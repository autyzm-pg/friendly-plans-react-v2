import React, { FC } from 'react';
import { NavigationProp } from '@react-navigation/native';

import { Plan, Student, StudentDisplayOption } from '../models';
import { Route } from '../navigation';
import { palette } from '../styles';
import { IconButton } from './IconButton';

interface Props {
  plan?: Plan;
  disabled?: boolean;
  size?: number;
  navigation: NavigationProp<any>;
  student?: Student
}

export const PlayButton: FC<Props> = ({ plan, disabled, size, navigation, student }) => {
  const navigateToRunPlan = () => {
    if (!plan || !student) {
      return;
    }

    switch (student.displaySettings) {
      case StudentDisplayOption.LargeImageSlide:
      case StudentDisplayOption.ImageWithTextSlide:
      case StudentDisplayOption.TextSlide:
        navigation.navigate(Route.RunPlanSlide, {
          plan,
          student,
        });
        break;
      default:
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
      color={disabled ? palette.textDisabled : palette.playButton}
      onPress={navigateToRunPlan}
    />
  );
};
