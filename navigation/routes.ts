/* eslint-disable prettier/prettier */
// Always try to use Route from enum instead of magic strings

export enum Route {
  // AuthSwitchNavigator
  Welcome = 'Welcome',
  Unauthenticated = 'Unauthenticated',
  Authenticated = 'Authenticated',
  // RootStackNavigator
  Root = 'Root',
  Dialog = 'Dialog',
  StudentSettings = 'StudentSettings',
  StudentCreate = 'StudentCreate',
  StudentsList = 'StudentsList',
  StudentsListSearch = 'StudentsListSearch',
  StudentsListSearchForCopyPlan = 'StudentsListSearchForCopyPlan',
  StudentsListForCopyPlan = 'StudentsListForCopyPlan',
  PlansListForCopy = 'PlansListForCopy',
  PlanSearchForCopy = 'PlanSearchForCopy',
  // MainStackNavigator
  Dashboard = 'Dashboard',
  PlanActivity = 'PlanActivity',
  RunPlanList = 'RunPlanList',
  RunPlanSlide = 'RunPlanSlide',
  RunSubPlanList = 'RunSubPlanList',
  RunSubPlanSlide = 'RunSubPlanSlide',
  PlanItemTask = 'PlanItemTask',
  ImageLibrary = 'ImageLibrary',
  RecordingLibrary = 'RecordingLibrary',
  RecordingNameEditor = 'RecordingNameEditor',
  // UnauthenticatedStackNavigator
  SignIn = 'SignIn',
  SignUp = 'SignUp',
  ResetPassword = 'ResetPassword',
  // MainDrawerNavigator
  Home = 'Home',
  Logout = 'Logout',
  // ModeSwitching
  ModeSwitch = 'ModeSwitch',
}
