// import { RNFirebase } from '@react-native-firebase/app';
import ImagePicker from 'react-native-image-crop-picker';
import { PlanItemFormData } from '../screens/planItemActivity/PlanItemForm';
import { i18n } from '../locale';
import { getPlanItemRef, getPlanItemsRef, getPlanSubItemsRef } from './FirebaseRefProxy';
import { Plan } from './Plan';
import { PlanElement } from './PlanElement';
import { PlanSubItem } from './PlanSubItem';
import { ParameterlessConstructor, SubscribableModel } from './SubscribableModel';
import { executeQuery } from '../services/DatabaseService';

export enum PlanItemType {
  SimpleTask = 'simpleTask',
  ComplexTask = 'complexTask',
  Break = 'break',
  Interaction = 'interaction',
  SubElement = 'subElement',
}

interface PlanItemsIcons {
  [key: string]: string;
}

export const PLAN_ITEMS_ICONS: PlanItemsIcons = {
  simpleTask: 'layers-clear',
  complexTask: 'layers',
  break: 'notifications',
  interaction: 'group',
};

export class PlanItem implements PlanElement {
  // static create = (
  //   plan: Plan,
  //   type: PlanItemType,
  //   name: string = i18n.t('updatePlan:planItemNamePlaceholder'),
  //   lastItemOrder: number,
  // ): Promise<RNFirebase.firestore.DocumentReference> =>
  //   getPlanItemsRef(plan.studentId, plan.id).add({
  //     name,
  //     studentId: plan.studentId,
  //     planId: plan.id,
  //     type,
  //     completed: false,
  //     lector: false,
  //     nameForChild: i18n.t('planItemActivity:taskNameForChild'),
  //     itemOrder: lastItemOrder + 1,
  //     voicePath: '',
  //   });

  // static async createPlanItem(
  //   plan: Plan,
  //   type: PlanItemType,
  //   data: PlanItemFormData,
  //   lastItemOrder: number,
  // ): Promise<PlanItem> {
  //   const { id } = await getPlanItemsRef(plan.studentId, plan.id).add({
  //     name: data.name,
  //     studentId: plan.studentId,
  //     planId: plan.id,
  //     type,
  //     completed: false,
  //     lector: data.lector,
  //     nameForChild: data.nameForChild,
  //     itemOrder: lastItemOrder + 1,
  //     time: data.time,
  //     image: data.imageUri,
  //     voicePath: data.voicePath,
  //   });

  //   return Object.assign(new PlanItem(), {
  //     id,
  //     name: data.name,
  //     studentId: plan.studentId,
  //     planId: plan.id,
  //     type,
  //     completed: false,
  //     lector: data.lector,
  //     nameForChild: data.nameForChild,
  //     itemOrder: lastItemOrder + 1,
  //     time: data.time,
  //     image: data.imageUri,
  //     voicePath: data.voicePath,
  //   });
  // }

  id!: string;
  name!: string;
  type!: PlanItemType;
  planId!: string;
  studentId!: string;
  completed!: boolean;
  time!: number;
  image!: string;
  lector!: boolean;
  nameForChild!: string;
  itemOrder!: number;
  voicePath!: string;
  planElementId!: string;
  pressed?: boolean;

  getIconName = (): string => PLAN_ITEMS_ICONS[this.type];

  isTask = (): boolean => this.type === PlanItemType.SimpleTask || this.type === PlanItemType.ComplexTask;
  isSimpleTask = (): boolean => this.type === PlanItemType.SimpleTask;
  complete = () => {
    this.update({ completed: true });
  };

  update = (item: Partial<PlanItem>) => {

  }

  setOrder = (itemOrder: number) => {
    this.update({ itemOrder });
  };
  setComplete = (completed: boolean) => {
    this.update({ completed });
  };

  changeType = (type: PlanItemType) => {
    this.update({
      type,
    });
  };

  setTimer = (type: number) => {
    this.update({ type });
  };

  // update = (changes: object) => getPlanItemRef(this.studentId, this.planId, this.id).update(changes);
  // delete = async () => {
  //   await this.deleteChildren();
  //   if(this.image) {
  //     await ImagePicker.cleanSingle(this.image.substring(0, this.image.lastIndexOf('/')));
  //   }

  //   if(this.voicePath) {
  //     await ImagePicker.cleanSingle(this.voicePath.substring(0, this.voicePath.lastIndexOf('/')));
  //   }

  //   await this.getRef().delete();
  // };

  // deleteChildren = async () => {
  //  this.getChildCollectionRef().get().then(snap => {
  //    snap.docs.forEach(doc => {
  //      const image = doc.get('image');
  //      const voicePath = doc.get('voicePath');
  //      if (image) {
  //        ImagePicker.cleanSingle(image.substring(0, image.lastIndexOf('/')));
  //      }

  //      if(voicePath) {
  //        ImagePicker.cleanSingle(voicePath.substring(0, voicePath.lastIndexOf('/')));
  //      }

  //      doc.ref.delete();
  //    });
  //  });
  // };

  // getChildCollectionRef: () => RNFirebase.firestore.CollectionReference = () =>
  //   getPlanSubItemsRef(this.studentId, this.planId, this.id);
  // getChildType: () => ParameterlessConstructor<SubscribableModel> = () => PlanSubItem;
  // getRef: () => RNFirebase.firestore.DocumentReference = () => getPlanItemRef(this.studentId, this.planId, this.id);

  static createPlanItem = async (
    plan: Plan,
    type: PlanItemType,
    data: PlanItemFormData,
    lastItemOrder: number
  ): Promise<PlanItem> => {
    const planItemData = {
      name: data.name,
      studentId: plan.studentId,
      planId: plan.id,
      type,
      completed: false,
      lector: data.lector,
      nameForChild: data.nameForChild,
      itemOrder: lastItemOrder + 1,
      time: data.time,
      image: data.imageUri,
      voicePath: data.voicePath,
    }
    
    const insertIntoPlanItemTable = `
      INSERT INTO PlanItem (planId, planElementId)
      VALUES ((?), (?));
    `;
    
    const insertIntoPlanElementTable = `INSERT INTO PlanElement (name, type, completed, time, lector, nameForChild, image, voicePath, itemOrder) VALUES ((?), (?), (?), (?), (?), (?), (?), (?), (?));`;
    await executeQuery('BEGIN TRANSACTION;');

    await executeQuery(insertIntoPlanElementTable, [
      data.name,
      type,
      0,
      data.time,
      data.lector ? 1 : 0,
      data.nameForChild,
      data.imageUri,
      data.voicePath,
      lastItemOrder + 1
    ]);
    
    const resultSet = await executeQuery(`SELECT * FROM PlanElement WHERE name = (?) ORDER BY id DESC LIMIT 1`, [data.name])
    
    if (!(resultSet.rows.length)) {
      await executeQuery('ROLLBACK;');
      throw new Error('Could not create new plan element')
    }

    await executeQuery(insertIntoPlanItemTable, [
      plan.id, 
      (resultSet.rows.item(0) as PlanElement).id
    ]);

    const itemResultSet = await executeQuery(`SELECT * FROM PlanItem ORDER BY id DESC LIMIT 1;`);
    
    if (!(itemResultSet.rows.length)) {
      await executeQuery('ROLLBACK;');
      throw new Error('Could not create new plan item');
    } else {
      await executeQuery('COMMIT;');
    }

    const item = itemResultSet.rows.item(0) as PlanItem;
    const element = resultSet.rows.item(0) as PlanElement;
    return Object.assign(new PlanItem(), {
      id: item.id,
      name: element.name,
      studentId: plan.studentId,
      planId: item.planId,
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

  static getPlanItems = async (plan: Plan): Promise<PlanItem[]> => {
    executeQuery(`SELECT * FROM PlanElement;`, []).then(res => console.log('RESULT', res.rows.item(0), res.rows.item(1),res.rows.item(2)));
    await executeQuery('BEGIN TRANSACTION;');

    const selectAllPlanItemsForPlan = `SELECT * FROM PlanItem WHERE planId = (?);`;
    const itemResultSet = await executeQuery(selectAllPlanItemsForPlan, [plan.id]);
    let lastItemOrder = -1;
    let resultsArray: PlanItem[] = [];
    for (let i = 0; i < itemResultSet.rows.length; i++) {
      const item = itemResultSet.rows.item(i) as PlanItem;
      const selectPlanElement = `SELECT * FROM PlanElement WHERE id = (?);`;
      const elementResultSet = await executeQuery(selectPlanElement, [item.planElementId]);
      if (!(elementResultSet.rows.length)) {
        await executeQuery('ROLLBACK;');
        throw new Error('Could not get plan element')
      }
      const element = elementResultSet.rows.item(0) as PlanElement;
      resultsArray.push(
      Object.assign(new PlanItem(), {
        id: item.id,
        name: element.name,
        studentId: plan.studentId,
        planId: item.planId,
        type: element.type,
        completed: element.completed,
        lector: element.lector,
        nameForChild: element.nameForChild,
        itemOrder: element.itemOrder,
        time: element.time,
        image: element.image,
        voicePath: element.voicePath,
        planElementId: element.id
      }))
    }
    await executeQuery('COMMIT;');
    console.log(resultsArray)
    return resultsArray.sort((a, b) => a.itemOrder - b.itemOrder);
  }

  static updatePlanItem = async (
    planItem: PlanItem
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

      executeQuery(`SELECT * FROM PlanElement;`, []);
    
    } catch (error) {
        console.error("Error updating plan:", error);
    }
  }

  static deletePlanItem = async (planItem: PlanItem): Promise<void> => {
    const deleteStudentData = `DELETE FROM PlanItem WHERE id = (?);`;
    await executeQuery(deleteStudentData, [planItem.id]);
    return 
  }
}
