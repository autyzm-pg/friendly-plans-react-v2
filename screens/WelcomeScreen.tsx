/* eslint-disable prettier/prettier */
import React, { useEffect, FC } from 'react';
// import firebase from '@react-native-firebase/app';
// import SplashScreen from 'react-native-splash-screen';

import {FullScreenTemplate} from '../components/FullScreenTemplate';
import { Route } from '../navigation/routes';
// import {Route} from '../navigation';
// import {NavigationInjectedProps} from '@react-navigation/native';

interface Props {
  navigation: any
}

export const WelcomeScreen: FC<Props> = ({ navigation }) => {
  // componentDidMount() {
  //   const currentUser = firebase.auth().currentUser;
  //   if (currentUser) {
  //     this.props.navigation.navigate(Route.Authenticated);
  //   } else {
  //     this.props.navigation.navigate(Route.Unauthenticated);
  //   }
  // }

  // componentWillUnmount() {
  //   SplashScreen.hide();
  // }

  useEffect(() => {
    console.log('Component mounted');
    //const currentUser = firebase.auth().currentUser;
    //if (currentUser) {
    //  this.props.navigation.navigate(Route.Authenticated);
    //} else {
    navigation.navigate(Route.Dashboard);
    //}
    // const handleAppStateChange = (nextAppState) => {
    //   console.log('App state changed to:', nextAppState);
    // };
    // AppState.addEventListener('change', handleAppStateChange);

    // return () => {
    //   console.log('Component unmounted');
    //   AppState.removeEventListener('change', handleAppStateChange);
    // };
  }, []);

  return (<FullScreenTemplate />);
}

