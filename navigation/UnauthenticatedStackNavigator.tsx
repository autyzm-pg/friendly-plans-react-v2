// import React from 'react';
// import { createStackNavigator } from '@react-navigation/native';

// import { Icon } from 'components';
// import { i18n } from 'locale';
// import { headerStyle, palette } from '../styles';
// import { Route } from './routes';

// export const UnauthenticatedStackNavigator = createStackNavigator(
//   {
//     [Route.SignIn]: {
//       screen: SignInScreen,
//       navigationOptions: {
//         title: i18n.t('signIn:signIn'),
//       },
//     },
//     [Route.SignUp]: {
//       screen: SignUpScreen,
//       navigationOptions: {
//         title: i18n.t('signUp:signUp'),
//       },
//     },
//     [Route.ResetPassword]: {
//       screen: ResetPasswordScreen,
//       navigationOptions: {
//         title: i18n.t('resetPassword:resetPassword'),
//       },
//     },
//   },
//   {
//     headerLayoutPreset: 'center',
//     defaultNavigationOptions: {
//       headerTintColor: palette.primary,
//       headerTitleStyle: headerStyle.headerText,
//       headerStyle: headerStyle.header,
//       headerBackImage: <Icon name="arrow-left" color={palette.textWhite} />,
//     },
//   },
// );
import {Route} from './routes';
import { ResetPasswordScreen, SignInScreen, SignUpScreen } from '../screens';

import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

export function UnauthenticatedStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={Route.SignIn}
      screenOptions={{gestureEnabled: false, headerShown: false}}>
      <Stack.Screen
        name={Route.SignIn}
        component={SignInScreen}
        options={{title: 'Sign in'}}
      />
      <Stack.Screen
        name={Route.SignUp}
        component={SignUpScreen}
        options={{title: 'Sign up'}}
      />
      <Stack.Screen
        name={Route.ResetPassword}
        component={ResetPasswordScreen}
        options={{title: 'Reset password'}}
      />
    </Stack.Navigator>
  );
}