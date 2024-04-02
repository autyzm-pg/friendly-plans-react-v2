import SQLite, {ResultSet} from 'react-native-sqlite-storage';
export default class DatabaseService {
  private static database: SQLite.SQLiteDatabase | undefined;
  private readonly databaseName: string = 'test_db.db';
  private readonly databaseVersion: number = 1;

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
      createTables();
    } catch (error) {
      console.error('Error opening database:', error);
    }
  }

  async closeDatabase(): Promise<void> {
    if (DatabaseService.database) {
      await DatabaseService.database.close();
    }
  }
}

export const createTables = async () => {

  const createPlanTable = `CREATE TABLE IF NOT EXISTS Plan (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,studentId INTEGER,emoji TEXT)`;

  const createPlanItemTable = `CREATE TABLE IF NOT EXISTS PlanItem (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    planId INTEGER,
    planElementId INTEGER,
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
    [order] INTEGER,
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
    CHECK (displaySettings IN ('largeImageSlide', 'imageWithTextSlide', 'textSlide', 'imageWithTextList', 'textList')),
    CHECK (textSize IN ('s', 'm', 'l', 'xl'))
  )`;
  
  await executeQuery(createPlanTable);
  await executeQuery(createPlanItemTable);
  await executeQuery(createPlanElementTable);
  await executeQuery(createPlanSubItemTable);
  await executeQuery(createStudentDataTable);
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
  INSERT INTO PlanElement (name, type, completed, time, lector, nameForChild, image, voicePath, [order])
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
          console.log('Error:', error);
          reject(error);
          return false;
        });
    });
  })
}
