/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
// import {Animated, Easing} from 'react-native';
import {WelcomeScreen} from '../screens/WelcomeScreen';

// import {
//   DialogScreen,
//   PlanSearchForCopyScreen,
//   PlansListForCopyScreen,
//   StudentCreateScreen,
//   StudentSettingsScreen,
//   StudentsListForCopyPlanScreen,
//   StudentsListScreen,
//   StudentsListSearchForCopyPlanScreen,
//   StudentsListSearchScreen,
// } from 'screens';

// import {AuthSwitchNavigator} from './AuthSwitchNavigator';
import {Route} from './routes';

import {createStackNavigator} from '@react-navigation/stack';
import {UnauthenticatedStackNavigator} from './UnauthenticatedStackNavigator';
import DashboardScreen from '../screens/dashboard/DashboardScreen';

const Stack = createStackNavigator();

export function RootStack() {
  return (
    <Stack.Navigator
      initialRouteName={Route.Home}
      screenOptions={{gestureEnabled: false, headerShown: false}}>
      <Stack.Screen
        name={Route.Home}
        component={WelcomeScreen}
        options={{title: 'My app'}}
      />
      <Stack.Screen
        name={Route.Unauthenticated}
        component={UnauthenticatedStackNavigator}
        options={{title: 'My app'}}
      />
      <Stack.Screen
        name={Route.Dashboard}
        component={DashboardScreen}
        options={{title: 'My app'}}
      />
    </Stack.Navigator>
  );
}

// /*
//  * This is the outermost navigator. All routes listed here will be accessible
//  * from every point in the app. It might be a perfect choice to put your
//  * modal and dialog screens.
//  * */
// export const RootStackNavigator = createStackNavigator(
//   {
//     [Route.Root]: AuthSwitchNavigator,
//     [Route.Dialog]: DialogScreen,
//     [Route.StudentSettings]: StudentSettingsScreen,
//     [Route.StudentCreate]: StudentCreateScreen,
//     [Route.StudentsList]: StudentsListScreen,
//     [Route.StudentsListSearch]: StudentsListSearchScreen,
//     [Route.StudentsListSearchForCopyPlan]: StudentsListSearchForCopyPlanScreen,
//     [Route.StudentsListForCopyPlan]: StudentsListForCopyPlanScreen,
//     [Route.PlanSearchForCopy]: PlanSearchForCopyScreen,
//     [Route.PlansListForCopy]: PlansListForCopyScreen,
//   },
//   {
//     headerMode: 'none',
//     mode: 'modal',
//     transparentCard: true,
//     defaultNavigationOptions: {
//       gesturesEnabled: false,
//     },
//     transitionConfig: /* istanbul ignore next */ () => ({
//       transitionSpec: {
//         duration: 200,
//         easing: Easing.inOut(Easing.ease),
//         timing: Animated.timing,
//       },
//       screenInterpolator: (sceneProps: NavigationSceneRendererProps) => {
//         const {position, scene} = sceneProps;
//         const {index} = scene;

//         const opacity = position.interpolate({
//           inputRange: [index - 1, index],
//           outputRange: [0, 1],
//         });

//         return {opacity};
//       },
//     }),
//   },
// );
