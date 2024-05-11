import { executeQuery } from '../services/DatabaseService';
import { Plan } from './Plan';

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

export class Student implements StudentData {

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

  static getPlansCount = async (studentId: string): Promise<number> => {
    const selectAllFromPlanTable = `SELECT * FROM Plan WHERE studentId = (?);`;
    const resultSet = await executeQuery(selectAllFromPlanTable, [studentId]);
    return resultSet.rows.length || 0;
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

  static updateStudentData = async (student: StudentData, studentId: string): Promise<void> => {
    try {
      const updateQuery = `
          UPDATE StudentData
          SET name = (?), displaySettings = (?), textSize = (?), isUpperCase = (?), isSwipeBlocked = (?)
          WHERE id = (?);
      `;

      const params = [
        student.name,
        student.displaySettings,
        student.textSize,
        student.isUpperCase ? 1 : 0,
        student.isSwipeBlocked ? 1 : 0,
        studentId
      ];

      await executeQuery(updateQuery, params);
    } catch (error) {
        console.error("Error updating student:", error);
    }
  }

  static deleteStudent = async (student: Student): Promise<void> => {
    const deleteStudentData = `DELETE FROM StudentData WHERE id = (?);`;

    const plans = await Plan.getPlans(student.id);
    plans.forEach(async(plan) => (await Plan.deletePlan(plan)));

    await executeQuery(deleteStudentData, [student.id]);

    return;
  }

  static getFirstStudent = async (): Promise<Student> => {
    const resultSet = await executeQuery(`SELECT * FROM StudentData ORDER BY id ASC LIMIT 1;`);
    
    if (!(resultSet.rows.length)) {
      throw new Error('Could not find any students')
    }
    
    return resultSet.rows.item(0)
  }

  static equals = (o1: StudentData, o2: StudentData) => {
    return (
      o1.name === o2.name
      && o1.displaySettings === o2.displaySettings
      && o1.isSwipeBlocked === o2.isSwipeBlocked
      && o1.isUpperCase === o2.isUpperCase
      && o1.textSize === o2.textSize
    )
  }

  // TODO: removing student's plans if student is deleted
}
