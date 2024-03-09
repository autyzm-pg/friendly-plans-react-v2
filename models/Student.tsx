import { RNFirebase } from '@react-native-firebase/app';


import {getPlansRef, getStudentRef, getStudentsRef} from './FirebaseRefProxy';
import { Plan } from './Plan';
import { ParameterlessConstructor, SubscribableModel } from './SubscribableModel';

export enum StudentDisplayOption {
  LargeImageSlide = 'largeImageSlide',
  ImageWithTextSlide = 'imageWithTextSlide',
  TextSlide = 'textSlide',
  ImageWithTextList = 'imageWithTextList',
  TextList = 'textList',
}

export enum StudentTextSizeOption {
  Small = 's',
  Medium = 'm',
  Large = 'l',
  ExtraLarge = 'xl',
}

export interface StudentData {
  name: string;
  displaySettings: StudentDisplayOption;
  textSize: StudentTextSizeOption;
  isUpperCase: boolean;
  isSwipeBlocked: boolean;
}

// TODO: change so that student does not implement SubscribableModel
export class Student implements SubscribableModel, StudentData {

  // TODO: save new student to database
  static create = (data: StudentData): void => {
    console.log("Adding new student", data)
  }

  id!: string;
  name: string;
  displaySettings: StudentDisplayOption;
  textSize: StudentTextSizeOption;
  isUpperCase: boolean;
  isSwipeBlocked: boolean;
  collectionCount: number = 0;

  constructor() {
    this.name = '';
    this.displaySettings = StudentDisplayOption.ImageWithTextSlide;
    this.textSize = StudentTextSizeOption.Large;
    this.isUpperCase = false;
    this.isSwipeBlocked = false;
  }

  update = (changes: Partial<StudentData>) => getStudentRef(this.id).update(changes);
  delete = () => {
    this.deleteChildren();
    this.getRef().delete();
  };

  deleteChildren = () => {
    this.getChildCollectionRef().get().then(planSnap => {
      planSnap.docs.forEach(plan => {
        this.deleteGrandChildren(plan.ref.collection('planItems'));
        plan.ref.delete();
      });
    });
  };

  deleteGrandChildren = (grandChildrenRef: RNFirebase.firestore.CollectionReference) => {
    grandChildrenRef.get().then(snap => {
      snap.docs.forEach(doc => {
        this.deleteGrandGrandChildren(doc.ref.collection('subItems'));
        doc.ref.delete();
      });
    });
  };

  deleteGrandGrandChildren = (grandGrandChildrenRef: RNFirebase.firestore.CollectionReference) => {
    grandGrandChildrenRef.get().then(snap => {
      snap.docs.forEach(doc => {
        doc.ref.delete();
      });
    });
  };



  getChildCollectionRef: () => RNFirebase.firestore.CollectionReference = () => getPlansRef(this.id);
  getChildType: () => ParameterlessConstructor<SubscribableModel> = () => Plan;
  getRef: () => RNFirebase.firestore.DocumentReference = () => getStudentRef(this.id);

  getCollectionCount = (callback: (element: number) => void): void => {
    this.getChildCollectionRef().onSnapshot(this.countCollection(callback));
  };

  setCollectionCount = (count: number) => {
    this.collectionCount = count;
  };

  private countCollection = (
      callback: (element: number) => void,
  ): ((querySnapshot: RNFirebase.firestore.QuerySnapshot) => void) => {
    return querySnapshot => {
      callback(querySnapshot.size);
    };
  };
}
