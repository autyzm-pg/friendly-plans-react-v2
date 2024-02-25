import { RNFirebase } from '@react-native-firebase/app';
import ImagePicker from 'react-native-image-crop-picker';
import { OperationalError } from '../infrastructure/Errors';
import { i18n } from '../locale';
import { getPlanSubItemRef, getPlanSubItemsRef } from './FirebaseRefProxy';
import { PlanElement } from './PlanElement';
import { PlanItem, PlanItemType } from './PlanItem';
import { ParameterlessConstructor, SubscribableModel } from './SubscribableModel';

export class PlanSubItem implements SubscribableModel, PlanElement {
  static create = (planItem: PlanItem): Promise<RNFirebase.firestore.DocumentReference> => {
    if (planItem.type !== PlanItemType.ComplexTask) {
      throw new OperationalError('Sub item can be created only for ComplexTask');
    }
    return getPlanSubItemsRef(planItem.studentId, planItem.planId, planItem.id).add({
      name: i18n.t('updatePlan:planItemNamePlaceholder'),
      order: 0,
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
  order!: number;
  type: PlanItemType = PlanItemType.SubElement;
  lector!: boolean;
  voicePath!: string;


  complete = () => {
    this.update({ completed: true });
  };

  setOrder = (value: number) => this.order = value;

  getOrder: () => number = () => this.order;


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
}
