import React, { FC } from 'react';
import { NavigationProp } from '@react-navigation/native';

import { Plan, StudentDisplayOption } from '../models';
import { Route } from '../navigation';
import { palette } from '../styles';
import { IconButton } from './IconButton';

interface Props {
  plan?: Plan;
  disabled?: boolean;
  size?: number;
  navigation: NavigationProp<any>;
}

export const PlayButton: FC<Props> = ({ plan, disabled, size, navigation }) => {
  const navigateToRunPlan = () => {
    if (!plan) {
      return;
    }
    // TODO: get students settings
    // const student = navigation.getParam('student');

    // switch (student.displaySettings) {
    //   case StudentDisplayOption.LargeImageSlide:
    //   case StudentDisplayOption.ImageWithTextSlide:
    //   case StudentDisplayOption.TextSlide:
    //     navigation.navigate(Route.RunPlanSlide, {
    //       plan,
    //       student,
    //     });
    //     break;
    //   default:
    //     navigation.navigate(Route.RunPlanList, {
    //       itemParent: plan,
    //       student,
    //     });
    // }
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
