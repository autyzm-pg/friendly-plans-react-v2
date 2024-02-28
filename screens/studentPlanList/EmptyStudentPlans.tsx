import { i18n } from '../../locale';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { palette } from '../../styles';

import { Route } from '../../navigation';
import { StyledText } from '../../components';
import { CopyPlanButton } from './CopyPlanButton';
import { CreatePlanButton } from './CreatePlanButton';
import { DashboardBackground } from './DashboardBackground';
import { NavigationProp } from '@react-navigation/native';

interface Props {
  navigation: NavigationProp<any>;
}

export const EmptyStudentPlans: React.FC<Props> = ({ navigation }) => {

  const navigateToPlanActivity = () => {
    navigation.navigate(Route.PlanActivity, {
      numberPlan: 0,
    });
  };

  const navigateToCopyExistingPlan = async () => {
    navigation.navigate(Route.StudentsListForCopyPlan);
  };

  return (
    <View style={styles.container}>
      <DashboardBackground />
      <CreatePlanButton onPress={navigateToPlanActivity} />
      <StyledText style={styles.text}>{i18n.t('planList:conjunction')}</StyledText>
      <CopyPlanButton onPress={navigateToCopyExistingPlan}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.backgroundSurface,
  },
  text: {
    color: palette.primaryLight,
  },
});
