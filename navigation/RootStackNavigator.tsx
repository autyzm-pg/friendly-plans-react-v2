import {WelcomeScreen} from '../screens/WelcomeScreen';
import { Header } from '../components';

import {Route} from './routes';

import { useState } from 'react';
import { Easing } from 'react-native';
import {createStackNavigator, CardStyleInterpolators} from '@react-navigation/stack';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import { 
  PlanSearchForCopyScreen, 
  PlansListForCopyScreen, 
  StudentCreateScreen, 
  StudentSettingsScreen, 
  StudentsListForCopyPlanScreen, 
  StudentsListSearchForCopyPlanScreen, 
  StudentsListSearchScreen 
} from '../screens';
import { PlanActivityScreen } from '../screens/planActivity/PlanActivityScreen';
import { defaults } from '../mocks/defaults'
import { PlanItemTaskScreen } from '../screens/planItemActivity/PlanItemTaskScreen';
import { StudentsListScreen } from '../screens/studentsList/StudentsListScreen';
import { RunPlanSlideScreen } from '../screens/runPlan/SlideMode/RunPlanSlideScreen';

import { RootNavigatorContext } from '../contexts/RootNavigatorContext';
import { CurrentStudentContext } from '../contexts/CurrentStudentContext';
import { Student } from '../models';
import { ImageLibraryScreen } from '../screens/planItemActivity/ImageLibraryScreen';
import { RunSubPlanSlideScreen } from '../screens/runPlan/SlideMode/RunSubPlanSlideScreen';
import { RunPlanListScreen } from '../screens/runPlan/ListMode/RunPlanListScreen';
import { RunSubPlanListScreen } from '../screens/runPlan/ListMode/RunSubPlanListScreen';

const Stack = createStackNavigator();

export function RootStackNavigation() {
  const [editionMode, setEditionMode] = useState<boolean>(true);
  const [student, setStudent] = useState<Student | undefined>();

  return (
    <RootNavigatorContext.Provider value={{editionMode: editionMode, setEditionMode: () => setEditionMode(!editionMode)}}>
      <CurrentStudentContext.Provider value={{currentStudent: student, setCurrentStudent: setStudent}}>
      <Stack.Navigator
        initialRouteName={Route.Home}
        screenOptions={({ navigation, route }) => ({
          presentation: 'transparentModal',
          cardStyle: {
            backgroundColor: 'transparent',
          },
          gestureEnabled: false, 
          headerShown: true,
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 200, easing: Easing.inOut(Easing.ease) } },
            close: { animation: 'timing', config: { duration: 200, easing: Easing.inOut(Easing.ease) } },
          },
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
          header: (headerProps) => (
            <Header
              {...headerProps}
              navigation={navigation}
            />
          )})}>
        <Stack.Screen
          name={Route.Home}
          component={WelcomeScreen}
          options={{}}
        />
        <Stack.Screen
          name={Route.Dashboard}
          component={DashboardScreen}
          options={{}}
        />
        <Stack.Screen
          name={Route.PlanItemTask}
          component={PlanItemTaskScreen}
          options={{}}
        />
        <Stack.Screen
          name={Route.StudentSettings}
          component={StudentSettingsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={Route.PlanActivity}
          component={PlanActivityScreen}
          options={{}}
        />
        <Stack.Screen
          name={Route.StudentsList}
          component={StudentsListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={Route.StudentsListSearch}
          component={StudentsListSearchScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={Route.StudentCreate}
          component={StudentCreateScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={Route.StudentsListSearchForCopyPlan}
          component={StudentsListSearchForCopyPlanScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={Route.StudentsListForCopyPlan}
          component={StudentsListForCopyPlanScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={Route.PlanSearchForCopy}
          component={PlanSearchForCopyScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={Route.PlansListForCopy}
          component={PlansListForCopyScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={Route.RunPlanSlide}
          component={RunPlanSlideScreen}
          options={{}}
        />
        <Stack.Screen
          name={Route.ImageLibrary}
          component={ImageLibraryScreen}
          options={{}}
        />
        <Stack.Screen
          name={Route.RunSubPlanSlide}
          component={RunSubPlanSlideScreen}
          options={{}}
        />
        <Stack.Screen
          name={Route.RunPlanList}
          component={RunPlanListScreen}
          options={{}}
        />
        <Stack.Screen
          name={Route.RunSubPlanList}
          component={RunSubPlanListScreen}
          options={{}}
        />
        {/* TODO: uncomment working screen */}
        {/* 
        <Stack.Screen
          name={Route.Dialog}
          component={DialogScreen}
          options={{}}
        />*/
        }
      </Stack.Navigator>
      </CurrentStudentContext.Provider>
    </RootNavigatorContext.Provider>
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
    // [Route.StudentSettings]: StudentSettingsScreen,
    // [Route.StudentCreate]: StudentCreateScreen,
    // [Route.StudentsList]: StudentsListScreen,
    // [Route.StudentsListSearch]: StudentsListSearchScreen,
    // [Route.StudentsListSearchForCopyPlan]: StudentsListSearchForCopyPlanScreen,
    // [Route.StudentsListForCopyPlan]: StudentsListForCopyPlanScreen,
    // [Route.PlanSearchForCopy]: PlanSearchForCopyScreen,
    // [Route.PlansListForCopy]: PlansListForCopyScreen,
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
