import {WelcomeScreen} from '../screens/WelcomeScreen';
import { Header } from '../components';

import {Route} from './routes';

import { Easing } from 'react-native';
import {createStackNavigator, CardStyleInterpolators} from '@react-navigation/stack';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import { PlanSearchForCopyScreen, PlansListForCopyScreen, StudentCreateScreen, StudentSettingsScreen, StudentsListForCopyPlanScreen, StudentsListSearchForCopyPlanScreen, StudentsListSearchScreen } from '../screens';
import { PlanActivityScreen } from '../screens/planActivity/PlanActivityScreen';
import { defaults } from '../mocks/defaults'
import { PlanItemTaskScreen } from '../screens/planItemActivity/PlanItemTaskScreen';
import { StudentsListScreen } from '../screens/studentsList/StudentsListScreen';
import { RunPlanSlideScreen } from '../screens/runPlan/SlideMode/RunPlanSlideScreen';

const Stack = createStackNavigator();

export function RootStackNavigation() {
  return (
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
            student={route.params && route.params.student ? route.params.student : defaults.student}
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
      {/* TODO: uncomment working screen */}
      {/* 
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
        name={Route.Dialog}
        component={DialogScreen}
        options={{}}
      />*/
      }
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
