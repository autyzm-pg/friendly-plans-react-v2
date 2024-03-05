/* eslint-disable prettier/prettier */
import 'react-native-gesture-handler'
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
  useEffect(() => {
    SplashScreen.hide();
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
