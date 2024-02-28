import isEmpty from 'lodash.isempty';
import { RNFirebase } from '@react-native-firebase/app';
import ImagePicker from 'react-native-image-crop-picker';

import { DEFAULT_EMOJI } from '../assets/emojis';
import { getPlanItemsRef, getPlanRef, getPlansRef } from './FirebaseRefProxy';
import { PlanItem } from './PlanItem';
import { ParameterlessConstructor, SubscribableModel } from './SubscribableModel';

// TODO: SQLite: refactor to remove SubscribableModel and use SQL qeuries
export class Plan implements SubscribableModel {
  static create = (studentId: string, name: string): Promise<RNFirebase.firestore.DocumentReference> =>
    getPlansRef(studentId).add({
      name,
      studentId,
      emoji: DEFAULT_EMOJI,
    });

  static async isPlanExist(studentId: string, name: string, planId?: string): Promise<boolean> {
    const { docs }: RNFirebase.firestore.QuerySnapshot = await getPlansRef(studentId)
      .where('name', '==', name)
      .get();

    const plans = docs.filter(({ id }) => id !== planId);

    return !isEmpty(plans);
  }

  static async createPlan(studentId: string, name: string): Promise<Plan> {
    const { id } = await getPlansRef(studentId).add({
      name,
      studentId,
      emoji: DEFAULT_EMOJI,
    });

    return Object.assign(new Plan(), {
      id,
      name,
      studentId,
      emoji: DEFAULT_EMOJI,
    });
  }

  name!: string;
  id!: string;
  studentId!: string;
  emoji!: string;

  update = (changes: object) => getPlanRef(this.studentId, this.id).update(changes);
  delete = async () => {
    await this.deleteChildren();
    await this.getRef().delete();
  };

  deleteChildren = async () => {
    this.getChildCollectionRef().get().then(planItemsSnap => {
      planItemsSnap.docs.forEach(planItem => {
        this.deleteGrandChildren(planItem.ref.collection('subItems'));

        const image = planItem.get('image');
        if (image) {
          ImagePicker.cleanSingle(image.substring(0, image.lastIndexOf('/')));
        }
        planItem.ref.delete();
      });
    });
  };

  deleteGrandChildren = async (grandChildrenRef: RNFirebase.firestore.CollectionReference) => {
    grandChildrenRef.get().then(snap => {
      snap.docs.forEach(doc => {
        const image = doc.get('image');
        if (image) {
          ImagePicker.cleanSingle(image.substring(0, image.lastIndexOf('/')));
        }
        doc.ref.delete();
      });
    });
  };

  getChildCollectionRef: () => RNFirebase.firestore.Query = () =>
    getPlanItemsRef(this.studentId, this.id).orderBy('order', 'asc');
  getChildType: () => ParameterlessConstructor<SubscribableModel> = () => PlanItem;
  getRef: () => RNFirebase.firestore.DocumentReference = () => getPlanRef(this.studentId, this.id);


}
