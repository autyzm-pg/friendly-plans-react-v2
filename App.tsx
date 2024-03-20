/* eslint-disable prettier/prettier */
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import {I18nextProvider} from 'react-i18next';
import {StatusBar} from 'react-native';
import {i18n} from './locale';
import {RootStackNavigation} from './navigation/RootStackNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { Platform } from 'react-native';
// import {AnalyticsService, NavigationService} from './services';
import {statusBarHeight} from './styles';
import SafeAreaView  from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import DatabaseService, { executeQuery } from './services/DatabaseService';

// // Set status bar height on Android to support windowTranslucentStatus style
/* istanbul ignore next */
// if (Platform.OS === 'android') {
//   // @ts-ignore
//   SafeAreaView.setStatusBarHeight(statusBarHeight);
//   //setStatusBarHeight(statusBarHeight);
// }

// const AppContainer = createAppContainer(RootStackNavigator);
// setNavigationRef = (ref: NavigationContainerComponent) => {
//   NavigationService.setTopLevelNavigator(ref);
// };

export default function App() {
  // Only for testing if it works
  // After checking move operations to proper files,
  // for example to repositories for each model (Plan, PlanItem, etc.)
  const testDB = async () => {
    const db = new DatabaseService();
    await db.initializeDatabase();
    await executeQuery('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');
    await executeQuery('INSERT INTO users (name) VALUES (?)', ['John Doe']);
    const resultSet = await executeQuery('SELECT * FROM users');
    for (let i = 0; i < resultSet.rows.length; i++) {
      let row = resultSet.rows.item(i);
      console.log(row);
    }
  }
  useEffect(() => {
    SplashScreen.hide();
    testDB();
  }, []);
  return (
    <NavigationContainer>
      <I18nextProvider i18n={i18n}>
        <StatusBar hidden />
        <RootStackNavigation />
      </I18nextProvider>
    </NavigationContainer>
  );
}
