import ImagePicker from 'react-native-image-crop-picker';
import { OperationalError } from '../infrastructure/Errors';
import { i18n } from '../locale';
import { getPlanSubItemRef, getPlanSubItemsRef } from './FirebaseRefProxy';
import { PlanElement } from './PlanElement';
import { PlanItem, PlanItemType } from './PlanItem';
import { ParameterlessConstructor, SubscribableModel } from './SubscribableModel';
import { PlanItemFormData } from '../screens/planItemActivity/PlanItemForm';
import { executeQuery } from '../services/DatabaseService';

export class PlanSubItem implements SubscribableModel, PlanElement {
  static create = (planItem: PlanItem): Promise<RNFirebase.firestore.DocumentReference> => {
    if (planItem.type !== PlanItemType.ComplexTask) {
      throw new OperationalError('Sub item can be created only for ComplexTask');
    }
    return getPlanSubItemsRef(planItem.studentId, planItem.planId, planItem.id).add({
      name: i18n.t('updatePlan:planItemNamePlaceholder'),
      itemOrder: 0,
      time: 0,
      planItemId: planItem.id,
      planId: planItem.planId,
      studentId: planItem.studentId,
      completed: false,
      lector: false,
      image: '',
      voicePath: '',
    });
  };

  name!: string;
  id!: string;
  planItemId!: string;
  planId!: string;
  studentId!: string;
  completed!: boolean;
  image!: string;
  time!: number;
  itemOrder!: number;
  type: PlanItemType = PlanItemType.SubElement;
  lector!: boolean;
  voicePath!: string;
  nameForChild!: string;
  planElementId!: string;
  pressed?: boolean;

  complete = () => {
    this.update({ completed: true });
  };

  setOrder = (value: number) => this.itemOrder = value;

  getOrder: () => number = () => this.itemOrder;


  update = (changes: object) =>
    getPlanSubItemRef(this.studentId, this.planId, this.planItemId, this.id).update(changes);
  delete = async () => {
    if(this.image) {
      await ImagePicker.cleanSingle(this.image.substring(0, this.image.lastIndexOf('/')));
    }

    if(this.voicePath) {
      await ImagePicker.cleanSingle(this.voicePath.substring(0, this.voicePath.lastIndexOf('/')));
    }

    await getPlanSubItemRef(this.studentId, this.planId, this.planItemId, this.id).delete();
  }

  getChildCollectionRef: () => RNFirebase.firestore.CollectionReference = () => {
    throw new OperationalError('PlanSubItem does not have child collection');
  };
  getChildType: () => ParameterlessConstructor<SubscribableModel> = () => {
    throw new OperationalError('PlanSubItem does not have child type');
  };
  getRef: () => RNFirebase.firestore.DocumentReference = () =>
    getPlanSubItemRef(this.studentId, this.planId, this.planItemId, this.id);

  static createPlanSubItem = async (
    planItem: PlanItem,
    type: PlanItemType,
    planSubItem: PlanSubItem,
    lastItemOrder: number
  ): Promise<PlanSubItem> => {
    const planItemData = {
      name: planSubItem.name,
      type,
      completed: false,
      lector: planSubItem.lector,
      nameForChild: planSubItem.nameForChild,
      itemOrder: lastItemOrder + 1,
      time: planSubItem.time,
      image: planSubItem.image,
      voicePath: planSubItem.voicePath,
    }
    
    const insertIntoPlanSubItemTable = `
      INSERT INTO PlanSubItem (planItemId, planElementId)
      VALUES ((?), (?));
    `;
    
    const insertIntoPlanElementTable = `INSERT INTO PlanElement (name, type, completed, time, lector, nameForChild, image, voicePath, itemOrder) 
      VALUES ((?), (?), (?), (?), (?), (?), (?), (?), (?));
    `;
    await executeQuery('BEGIN TRANSACTION;');

    await executeQuery(insertIntoPlanElementTable, [
      planSubItem.name,
      type,
      0,
      planSubItem.time,
      planSubItem.lector ? 1 : 0,
      planSubItem.nameForChild,
      planSubItem.image,
      planSubItem.voicePath,
      lastItemOrder + 1
    ]);
    
    const resultSet = await executeQuery(`SELECT * FROM PlanElement WHERE name = (?) ORDER BY id DESC LIMIT 1`, [planSubItem.name])
    
    if (!(resultSet.rows.length)) {
      await executeQuery('ROLLBACK;');
      throw new Error('Could not create new plan element')
    }

    await executeQuery(insertIntoPlanSubItemTable, [
      planItem.id, 
      (resultSet.rows.item(0) as PlanElement).id
    ]);

    const itemResultSet = await executeQuery(`SELECT * FROM PlanSubItem ORDER BY id DESC LIMIT 1;`);
    
    if (!(itemResultSet.rows.length)) {
      await executeQuery('ROLLBACK;');
      throw new Error('Could not create new plan item');
    } else {
      await executeQuery('COMMIT;');
    }

    const subItem = itemResultSet.rows.item(0) as PlanItem;
    const element = resultSet.rows.item(0) as PlanElement;
    return Object.assign(new PlanSubItem(), {
      id: subItem.id,
      name: element.name,
      studentId: planItem.studentId,
      planItemId: planItem.id,
      planId: planItem.planId,
      type: element.type,
      completed: element.completed,
      lector: element.lector,
      nameForChild: element.nameForChild,
      itemOrder: lastItemOrder + 1,
      time: element.time,
      image: element.image,
      voicePath: element.voicePath,
      planElementId: element.id
    });
  }

  static getPlanSubItems = async (planItem: PlanItem): Promise<PlanSubItem[]> => {
    await executeQuery('BEGIN TRANSACTION;');

    const selectAllPlanSubItemsForPlan = `SELECT * FROM PlanSubItem WHERE planItemId = (?);`;
    const subItemResultSet = await executeQuery(selectAllPlanSubItemsForPlan, [planItem.id]);
    let lastItemOrder = -1;
    let resultsArray: PlanSubItem[] = [];
    for (let i = 0; i < subItemResultSet.rows.length; i++) {
      const subItem = subItemResultSet.rows.item(i) as PlanSubItem;
      const selectPlanElement = `SELECT * FROM PlanElement WHERE id = (?);`;
      const elementResultSet = await executeQuery(selectPlanElement, [subItem.planElementId]);
      if (!(elementResultSet.rows.length)) {
        await executeQuery('ROLLBACK;');
        throw new Error('Could not get plan element')
      }
      const element = elementResultSet.rows.item(0) as PlanElement;
      resultsArray.push(
        Object.assign(new PlanSubItem(), {
          id: subItem.id,
          name: element.name,
          studentId: planItem.studentId,
          planId: subItem.planId,
          type: element.type,
          completed: element.completed,
          lector: element.lector,
          nameForChild: element.nameForChild,
          itemOrder: element.itemOrder,
          time: element.time,
          image: element.image,
          voicePath: element.voicePath,
          planElementId: element.id
        })
      )
    }
    await executeQuery('COMMIT;');
    console.log(resultsArray)
    return resultsArray.sort((a, b) => Number(a.id) - Number(b.id));
  }

  static updatePlanSubItem = async (
    planItem: PlanSubItem,
  ): Promise<void> => {
    try {
      const updatePlanElementTable = `
        UPDATE PlanElement 
        SET name = (?), type = (?), completed = (?), time = (?), lector = (?), nameForChild = (?), image = (?), voicePath = (?), itemOrder = (?)
        WHERE id = (?);
      `;

      await executeQuery(updatePlanElementTable, [
        planItem.name,
        planItem.type,
        planItem.completed ? 1 : 0,
        planItem.time,
        planItem.lector ? 1 : 0,
        planItem.nameForChild,
        planItem.image,
        planItem.voicePath,
        planItem.itemOrder,
        planItem.planElementId
      ]);

    } catch (error) {
        console.error("Error updating plan:", error);
    }
  }
}
