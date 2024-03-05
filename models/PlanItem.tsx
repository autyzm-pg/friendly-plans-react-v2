import { RNFirebase } from '@react-native-firebase/app';
import ImagePicker from 'react-native-image-crop-picker';
import { PlanItemFormData } from 'screens/planItemActivity/PlanItemForm';
import { i18n } from '../locale';
import { getPlanItemRef, getPlanItemsRef, getPlanSubItemsRef } from './FirebaseRefProxy';
import { Plan } from './Plan';
import { PlanElement } from './PlanElement';
import { PlanSubItem } from './PlanSubItem';
import { ParameterlessConstructor, SubscribableModel } from './SubscribableModel';

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

export class PlanItem implements SubscribableModel, PlanElement {
  static create = (
    plan: Plan,
    type: PlanItemType,
    name: string = i18n.t('updatePlan:planItemNamePlaceholder'),
    lastItemOrder: number,
  ): Promise<RNFirebase.firestore.DocumentReference> =>
    getPlanItemsRef(plan.studentId, plan.id).add({
      name,
      studentId: plan.studentId,
      planId: plan.id,
      type,
      completed: false,
      lector: false,
      nameForChild: i18n.t('planItemActivity:taskNameForChild'),
      order: lastItemOrder + 1,
      voicePath: '',
    });

  static async createPlanItem(
    plan: Plan,
    type: PlanItemType,
    data: PlanItemFormData,
    lastItemOrder: number,
  ): Promise<PlanItem> {
    const { id } = await getPlanItemsRef(plan.studentId, plan.id).add({
      name: data.name,
      studentId: plan.studentId,
      planId: plan.id,
      type,
      completed: false,
      lector: data.lector,
      nameForChild: data.nameForChild,
      order: lastItemOrder + 1,
      time: data.time,
      image: data.imageUri,
      voicePath: data.voicePath,
    });

    return Object.assign(new PlanItem(), {
      id,
      name: data.name,
      studentId: plan.studentId,
      planId: plan.id,
      type,
      completed: false,
      lector: data.lector,
      nameForChild: data.nameForChild,
      order: lastItemOrder + 1,
      time: data.time,
      image: data.imageUri,
      voicePath: data.voicePath,
    });
  }

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
  order!: number;
  voicePath!: string;
  pressed?: boolean;


  getIconName = (): string => PLAN_ITEMS_ICONS[this.type];

  isTask = (): boolean => this.type === PlanItemType.SimpleTask || this.type === PlanItemType.ComplexTask;
  isSimpleTask = (): boolean => this.type === PlanItemType.SimpleTask;
  complete = () => {
    this.update({ completed: true });
  };

  setOrder = (order: number) => {
    this.update({ order });
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

  update = (changes: object) => getPlanItemRef(this.studentId, this.planId, this.id).update(changes);
  delete = async () => {
    await this.deleteChildren();
    if(this.image) {
      await ImagePicker.cleanSingle(this.image.substring(0, this.image.lastIndexOf('/')));
    }

    if(this.voicePath) {
      await ImagePicker.cleanSingle(this.voicePath.substring(0, this.voicePath.lastIndexOf('/')));
    }

    await this.getRef().delete();
  };

  deleteChildren = async () => {
   this.getChildCollectionRef().get().then(snap => {
     snap.docs.forEach(doc => {
       const image = doc.get('image');
       const voicePath = doc.get('voicePath');
       if (image) {
         ImagePicker.cleanSingle(image.substring(0, image.lastIndexOf('/')));
       }

       if(voicePath) {
         ImagePicker.cleanSingle(voicePath.substring(0, voicePath.lastIndexOf('/')));
       }

       doc.ref.delete();
     });
   });
  };

  getChildCollectionRef: () => RNFirebase.firestore.CollectionReference = () =>
    getPlanSubItemsRef(this.studentId, this.planId, this.id);
  getChildType: () => ParameterlessConstructor<SubscribableModel> = () => PlanSubItem;
  getRef: () => RNFirebase.firestore.DocumentReference = () => getPlanItemRef(this.studentId, this.planId, this.id);
}
