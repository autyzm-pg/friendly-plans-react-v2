import {getPlansRef, getStudentRef, getStudentsRef} from './FirebaseRefProxy';
import { Plan } from './Plan';
import { ParameterlessConstructor, SubscribableModel } from './SubscribableModel';
import { ResultSet } from 'react-native-sqlite-storage';
import { executeQuery } from '../services/DatabaseService';

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
export class Student implements StudentData {

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

  static createStudent = async (student: StudentData): Promise<Student> => {

    const insertIntoStudentDataTable = `
      INSERT INTO StudentData (name, displaySettings, textSize, isUpperCase, isSwipeBlocked)
      VALUES ((?), (?), (?), (?), (?));
    `;
    await executeQuery('BEGIN TRANSACTION;');

    await executeQuery(insertIntoStudentDataTable, [
      student.name, 
      student.displaySettings, 
      student.textSize, 
      student.isUpperCase ? 1 : 0, 
      student.isSwipeBlocked ? 1 : 0
    ]);
    
    const resultSet = await executeQuery(`SELECT * FROM StudentData WHERE name = (?) ORDER BY id DESC LIMIT 1`, [student.name])
    
    if (!(resultSet.rows.length)) {
      await executeQuery('ROLLBACK;');
      throw new Error('Could not create new student')
    } else {
      await executeQuery('COMMIT;');
    }
    
    return resultSet.rows.item(0)
  }

  static getStudents = async (): Promise<Student[]> => {
    // Sample data for inserting into StudentData table
    const selectAllFromStudentDataTable = `SELECT * FROM StudentData;`;
    const resultSet = await executeQuery(selectAllFromStudentDataTable)
    let resultsArray: Student[] = [];
    for (let i = 0; i < resultSet.rows.length; i++) {
      resultsArray.push(resultSet.rows.item(i));
    }
    return resultsArray;
  }

  static deleteStudent = async (student: Student): Promise<void> => {

    const deleteStudentData = `DELETE FROM StudentData WHERE id = (?);`;
    await executeQuery(deleteStudentData, [student.id]);

    return 
  }

  static getFirstStudent = async (): Promise<Student> => {
    
    const resultSet = await executeQuery(`SELECT * FROM StudentData ORDER BY id ASC LIMIT 1;`);
    
    if (!(resultSet.rows.length)) {
      throw new Error('Could not find any students')
    }
    
    return resultSet.rows.item(0)
  }
}
