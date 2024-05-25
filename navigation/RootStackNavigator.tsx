import { Header } from '../components';
import {Route} from './routes';
import { RootNavigatorContext } from '../contexts/RootNavigatorContext';
import { CurrentStudentContext } from '../contexts/CurrentStudentContext';
import { Student } from '../models';
import { useState } from 'react';
import { Easing } from 'react-native';
import {createStackNavigator, CardStyleInterpolators} from '@react-navigation/stack';

import DashboardScreen from '../screens/dashboard/DashboardScreen';
import { 
  PlanSearchForCopyScreen, 
  PlansListForCopyScreen, 
  RecordingLibraryScreen, 
  RecordingNameEditor, 
  StudentCreateScreen, 
  StudentSettingsScreen, 
  StudentsListForCopyPlanScreen, 
  StudentsListSearchForCopyPlanScreen, 
  StudentsListSearchScreen, 
  VoiceRecorder,
  PlanActivityScreen,
  PlanItemTaskScreen,
  StudentsListScreen,
  RunPlanSlideScreen,
  RunSubPlanSlideScreen,
  RunPlanListScreen,
  RunSubPlanListScreen,
  ImageLibraryScreen,
  ModeSwitchScreen,
} from '../screens';

const Stack = createStackNavigator();

export function RootStackNavigation() {
  const [editionMode, setEditionMode] = useState<boolean>(true);
  const [student, setStudent] = useState<Student | undefined>();
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <RootNavigatorContext.Provider value={{
      editionMode: editionMode, setEditionMode: () => setEditionMode(!editionMode),
      loading: loading, setLoading: () => setLoading(false)}}>
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
          name={Route.RecordingLibrary}
          component={RecordingLibraryScreen}
          options={{}}
        />
        <Stack.Screen
          name={Route.RecordingNameEditor}
          component={RecordingNameEditor}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={Route.VoiceRecorder}
          component={VoiceRecorder}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={Route.ModeSwitch}
          component={ModeSwitchScreen}
          options={{ headerShown: false }}
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
      </Stack.Navigator>
      </CurrentStudentContext.Provider>
    </RootNavigatorContext.Provider>
  );
}