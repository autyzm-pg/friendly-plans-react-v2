import React, { useEffect } from 'react';

import { BackHandler, StyleSheet, View } from 'react-native';
//import { NavigationInjectedProps } from '@react-navigation/native';

import {FullScreenTemplate} from '../../../components';
import { Route } from '../../../navigation';
import { palette } from '../../../styles';
import { PlanElementList } from './PlanElementList';
import { NavigationProp, RouteProp } from '@react-navigation/native';
interface Props {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}

export const RunPlanListScreen: React.FC<Props> = ({navigation, route}) => {
  const navigationOptions = {
    header: null,
  };

  const handleBackButton = () => {
    navigation.navigate(Route.Dashboard);
    return true;
  };
  
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => backHandler.remove();
  }, []);

  const handleGoBack = () => navigation.navigate(Route.Dashboard);

  const itemParent = route.params?.itemParent;
  const student = route.params?.student;

  return (
    <View style={styles.container}>
      <FullScreenTemplate padded darkBackground>
        <PlanElementList itemParent={itemParent} onGoBack={handleGoBack} navigation={navigation}/>
      </FullScreenTemplate>
    </View>
  ); 
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: palette.backgroundSurface,
  },
});
