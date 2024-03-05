// import { createDrawerNavigator } from '@react-navigation/drawer';

// // import { DrawerContent } from 'components';
// // import { palette } from '../styles';
// // import { MainStackNavigator } from './MainStackNavigator';
// // import { Route } from './routes';

// const Drawer = createDrawerNavigator();

// export function MainDrawerNavigation() {
//     return (
//       <Drawer.Navigator
//         initialRouteName={Route.Home}
//         screenOptions={({ navigation, route }) => ({
//           gestureEnabled: false, 
//           headerShown: true,
//           header: (headerProps) => (
//             <Header
//               {...headerProps}
//               student={route.params && route.params.student ? route.params.student : undefined}
//             />
//           )})}>
//         <Drawer.Screen
//           name={Route.Home}
//           component={WelcomeScreen}
//           options={{}}
//         />
//         </Drawer.Navigator>
//     )
// }