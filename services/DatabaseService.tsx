import SQLite, {ResultSet} from 'react-native-sqlite-storage';
import * as SampleData from '../assets/sample_plan/plan_selfcare.json';
import { Plan, PlanItem, Student, StudentDisplayOption, StudentTextSizeOption, TimerSound } from '../models';
import RNFS, { ReadDirItem } from 'react-native-fs';
import { copyFromAssetsToRNFS } from '../helpers/copyFile';
import { useCurrentStudentContext } from '../contexts/CurrentStudentContext';
import { Route } from '../navigation';
export default class DatabaseService {
  private static database: SQLite.SQLiteDatabase | undefined;
  private readonly databaseName: string = 'friendly_plans.db';
  private readonly DATABASE_VERSION: number = 2;

  constructor() {
  }

  static getDatabase() {
    if (DatabaseService.database) {
      return DatabaseService.database
    } else {
      console.log('Database not found')
    }
  }

  async initializeDatabase() {
    try {
      DatabaseService.database = await SQLite.openDatabase({
        name: this.databaseName,
        location: 'default'
      });

      console.log('Database opened');
      await createTables();
      await createInitPassword();
      await this.migrateDatabase();
    } catch (error) {
      console.error('Error opening database:', error);
    }
  }

  async closeDatabase(): Promise<void> {
    if (DatabaseService.database) {
      await DatabaseService.database.close();
    }
  }
  
  async migrateDatabase() {
    if (DatabaseService.database) {
      DatabaseService.database.transaction(tx => {
        tx.executeSql('PRAGMA user_version;', [], (tx, result) => {
          let currentVersion = result.rows.item(0).user_version;
          if (DatabaseService.database) {
            if (!currentVersion || currentVersion < 2) {
              DatabaseService.database.executeSql('ALTER TABLE Plan ADD COLUMN is_readonly INTEGER DEFAULT 0;');
              currentVersion = 2;
            }
            DatabaseService.database.executeSql(`PRAGMA user_version = ${this.DATABASE_VERSION};`);
          }
        });
      });
    }
  };
}

export const createInitPassword = async () => {
  const passwordTableEmptyCheck = `SELECT COUNT(*) as count FROM Password`;
  const result = await executeQuery(passwordTableEmptyCheck);
  const count = result.rows.item(0).count;

  if (count === 0) {
    const initPassword = `INSERT INTO Password (password) VALUES ('PP2024');`
    await executeQuery(initPassword);
  }
}

export const createTables = async () => {
  // await executeQuery('DROP TABLE Plan');
  // await executeQuery('DROP TABLE PlanItem');
  // await executeQuery('DROP TABLE PlanElement');
  // await executeQuery('DROP TABLE PlanSubItem');
  // await executeQuery('DROP TABLE StudentData');
  // await executeQuery('DROP TABLE Password');

  const createPlanTable = `CREATE TABLE IF NOT EXISTS Plan (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,studentId INTEGER,emoji TEXT)`;

  const createPlanItemTable = `CREATE TABLE IF NOT EXISTS PlanItem (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    planId INTEGER,
    planElementId INTEGER
  )`;

  const createPlanElementTable = `CREATE TABLE IF NOT EXISTS PlanElement (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    type TEXT,
    completed INTEGER DEFAULT 0,
    time INTEGER,
    lector INTEGER DEFAULT 0,
    nameForChild TEXT,
    image BLOB,
    voicePath BLOB,
    itemOrder INTEGER,
    CHECK (type IN ('simpleTask', 'complexTask', 'break', 'interaction', 'subElement')))
  `;

  const createPlanSubItemTable = `CREATE TABLE IF NOT EXISTS PlanSubItem (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    planItemId INTEGER,
    planElementId INTEGER
  )`;

  const createStudentDataTable = `CREATE TABLE IF NOT EXISTS StudentData (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    displaySettings TEXT,
    textSize TEXT,
    isUpperCase INTEGER DEFAULT 0,
    isSwipeBlocked INTEGER DEFAULT 0,
    timer TEXT,
    CHECK (displaySettings IN ('largeImageSlide', 'imageWithTextSlide', 'textSlide', 'imageWithTextList', 'textList')),
    CHECK (textSize IN ('s', 'm', 'l', 'xl'))
  )`;

  const createPasswordTable = `CREATE TABLE IF NOT EXISTS Password (id INTEGER PRIMARY KEY AUTOINCREMENT, password TEXT)`;
  const createEditionModeTable = `CREATE TABLE IF NOT EXISTS EditionMode (id INTEGER PRIMARY KEY AUTOINCREMENT, editionMode INTEGER)`;
  
  await executeQuery(createPlanTable);
  await executeQuery(createPlanItemTable);
  await executeQuery(createPlanElementTable);
  await executeQuery(createPlanSubItemTable);
  await executeQuery(createStudentDataTable);
  await executeQuery(createPasswordTable);
  await executeQuery(createEditionModeTable);
}

export const insertTestData = async () => {
  // Sample data for inserting into Plan table
  const insertIntoPlanTable = `
  INSERT INTO Plan (name, studentId, emoji) 
  VALUES ('Plan 1', 1, '😊'),
        ('Plan 2', 2, '📚'),
        ('Plan 3', 1, '⏰');
  `;

  // Sample data for inserting into PlanItem table
  const insertIntoPlanItemTable = `
  INSERT INTO PlanItem (planId, planElementId)
  VALUES (1, 1),
        (2, 2),
        (1, 4),
        (1, 5),
        (3, 3);
  `;

  // Sample data for inserting into PlanElement table
  const insertIntoPlanElementTable = `
  INSERT INTO PlanElement (name, type, completed, time, lector, nameForChild, image, voicePath, itemOrder)
  VALUES ('Task 1', 'simpleTask', 0, 60, 0, 'Task 1 for Child', NULL, NULL, 1),
        ('Task 2', 'complexTask', 0, 120, 0, 'Task 2 for Child', NULL, NULL, 2),
        ('Task 1', 'simpleTask', 0, 60, 0, 'Task 3 for Child', NULL, NULL, 1),
        ('Task 2', 'complexTask', 0, 120, 0, 'Task 4 for Child', NULL, NULL, 2),
        ('Break 1', 'break', 0, 10, 0, 'Break 1 for Child', NULL, NULL, 3);
  `;

  // Sample data for inserting into PlanSubItem table
  const insertIntoPlanSubItemTable = `
  INSERT INTO PlanSubItem (planItemId, planElementId)
  VALUES (1, 1),
        (2, 2),
        (3, 3);
  `;

  await executeQuery(insertIntoPlanTable);
  await executeQuery(insertIntoPlanItemTable);
  await executeQuery(insertIntoPlanElementTable);
  await executeQuery(insertIntoPlanSubItemTable);

}

/* 
  After the database connection is initialized at the app start, 
  just use this function for db queries

  Executes queries and retuns the ResultSet
  Params can be passed as the second argument and replaced by (?) in the query string
*/
export const executeQuery = async (query: string, params: (string | number | Date)[] = []): Promise<ResultSet> => {
  return new Promise((resolve, reject) => {
    const db = DatabaseService.getDatabase()
    if (!db) {
      reject(new Error('No database connected'));
      return;
    }
    db.transaction((tx) => {
      tx.executeSql(query, params, (tx, results) => {
          console.log("Query completed");
          resolve(results);
        }, (tx, error) => {
          console.log('Error:', error,);
          console.log('In query:', query);
          reject(error);
          return false;
        });
    });
  })
}

export const createTutorialWithSamplePlans = async (): Promise<Student | undefined> => {
  const students = await Student.getStudents();
  if (!students || students.length === 0) {
    const student = await Student.createStudent({
      name: 'Samouczek', 
      displaySettings: StudentDisplayOption.ImageWithTextSlide, 
      textSize: StudentTextSizeOption.Medium, 
      isUpperCase: true, 
      isSwipeBlocked: false, 
      timer: TimerSound.beep
    })

    await RNFS.mkdir(`${RNFS.DocumentDirectoryPath}/sample_plan/selfcare/`);
    await RNFS.mkdir(`${RNFS.DocumentDirectoryPath}/sample_plan/slides/`);
    await RNFS.mkdir(`${RNFS.DocumentDirectoryPath}/sample_plan/graphomotorics/`);
    await RNFS.mkdir(`${RNFS.DocumentDirectoryPath}/sample_plan/plan_pictures/`);
    await RNFS.mkdir(`${RNFS.DocumentDirectoryPath}/sample_plan/tutorial/`);

    const sampleData = require('../assets/sample_plan/plan_selfcare.json');
    
    for (const plan of sampleData) {
      const newPlan = await Plan.createPlan(student.id, plan.name, plan.emoji, plan.isReadonly);
      
      let index = 0;
      for (const planItem of plan.planItems) {
        planItem.imageUri = await copyFromAssetsToRNFS(planItem.imageUri);
        if (planItem.type === 'complexTask') {
          for (const subItem of planItem.subItems) {
            subItem.image = await copyFromAssetsToRNFS(subItem.image);
          }
        }
        const newPlanItem = await PlanItem.createPlanItem(newPlan, planItem.type, planItem, index - 1);
        index++;
      }
    }
    return student;
  }
}
