import React, {FC} from 'react';
import {StyleSheet, TouchableHighlight} from 'react-native';

import {StyledText} from '../../components';
import {Plan, PlanItem} from '../../models';
import {Route} from '../../navigation';
import {dimensions, palette, typography} from '../../styles';
import {NavigationProp} from '@react-navigation/native';
import { useCurrentStudentContext } from '../../contexts/CurrentStudentContext';

interface Props {
  plan: Plan;
  navigation: NavigationProp<any>;
}

export const PlanListElementForCopy: FC<Props> = ({plan, navigation}) => {
  
  const {currentStudent} = useCurrentStudentContext();
  const copyPlanAndNavigate = async () => {
    if (currentStudent) {
      const newPlan = await Plan.createPlan(currentStudent?.id, plan.name, plan.emoji);
      const planItems = await PlanItem.getPlanItems(plan);
      for (const item of planItems) {
        await PlanItem.copyPlanItem(newPlan, item.type, item);
      }
    }

    navigation.navigate(Route.Dashboard, {
      student: currentStudent,
    });
  };

  return (
    <TouchableHighlight style={styles.touchable} underlayColor={palette.underlay} onPress={copyPlanAndNavigate}>
      <StyledText style={styles.studentName}>{plan.name}</StyledText>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  touchable: {
    marginHorizontal: -dimensions.spacingBig,
    paddingHorizontal: dimensions.spacingBig,
  },
  studentName: {
    ...typography.subtitle,
    color: palette.textBody,
    marginTop: dimensions.spacingSmall,
    marginBottom: dimensions.spacingSmall,
  },
});