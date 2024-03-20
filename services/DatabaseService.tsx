import SQLite, {openDatabase, enablePromise, ResultSet} from 'react-native-sqlite-storage';

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
      console.log('Database not opened')
    }
  }

  async initializeDatabase() {
    try {
      DatabaseService.database = await SQLite.openDatabase({
        name: this.databaseName,
        location: 'default' 
      });
      console.log('Database opened');
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
          reject(error);
          return false;
        });
    });
  })
}
