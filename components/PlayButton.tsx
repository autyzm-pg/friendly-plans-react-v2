import React, { FC } from 'react';
import { NavigationProp } from '@react-navigation/native';

import { Plan, PlanItem, Student, StudentDisplayOption } from '../models';
import { Route } from '../navigation';
import { palette } from '../styles';
import { IconButton } from './IconButton';
import { useCurrentStudentContext } from '../contexts/CurrentStudentContext';
import { Alert } from 'react-native';
import { i18n } from '../locale';
import { useRootNavigatorContext } from '../contexts/RootNavigatorContext';

interface Props {
  plan?: Plan;
  disabled?: boolean;
  size?: number;
  navigation: NavigationProp<any>;
  student?: Student;
  onPlanRun?: () => void;
}

export const PlayButton: FC<Props> = ({ plan, disabled, size, navigation, student, onPlanRun }) => {
  const {currentStudent} = useCurrentStudentContext();
  const {editionMode} = useRootNavigatorContext();

  const navigateToRunPlan = async () => {
    if (!plan || !currentStudent) {
      return;
    }

    const items = await PlanItem.getPlanItems(plan);
    if (items.length === 0) {
      Alert.alert(i18n.t('planList:noTasks'), i18n.t('planList:noTasksDescription', {name: plan.name}), [
        {
          text: i18n.t('common:ok'),
          onPress: () => {},
        },
      ]);
      return;
    } else if (!items.find(item => !item.completed)) {
      Alert.alert(i18n.t('planList:allTasksCompleted'), 
      i18n.t('planList:allTasksCompletedDescription', {name: plan.name})
      + ' ' + (editionMode ? i18n.t('planList:stateChangeInfo') : '')
      , [
        {
          text: i18n.t('common:ok'),
          onPress: () => {},
        },
      ]);
      return;
    }

    onPlanRun && onPlanRun();

    switch (currentStudent.displaySettings) {
      case StudentDisplayOption.LargeImageSlide:
      case StudentDisplayOption.ImageWithTextSlide:
      case StudentDisplayOption.TextSlide:
        navigation.navigate(Route.RunPlanSlide, {
          plan,
          student,
        });
        break;
        case StudentDisplayOption.ImageWithTextList:
          case StudentDisplayOption.TextList:
        navigation.navigate(Route.RunPlanList, {
          itemParent: plan,
          student,
        });
    }
  };

  return (
    <IconButton
      name="play-circle"
      disabled={disabled}
      size={size}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      color={disabled ? palette.textDisabled : palette.playButton}
      onPress={navigateToRunPlan}
    />
  );
};
