import React, { FC, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { FloatingAction } from 'react-native-floating-action';

import { Icon } from '../../components';
import { i18n } from '../../locale';
import { palette, typography } from '../../styles';

const actionNames = {
  simpleTask: 'create-simple-task',
  complexTask: 'create-complex-task',
  interaction: 'create-interaction',
  break: 'create-break',
};

const actions = [
  {
    name: actionNames.simpleTask,
    icon: <Icon name="layers-clear" type="material" color={palette.primary} size={24} />,
    text: i18n.t('updatePlan:addSimpleTask'),
    position: 1,
    color: palette.background,
    textBackground: palette.primaryVariant,
    textStyle: typography.caption,
    textElevation: 0,
    textColor: palette.textWhite,
  },
  {
    name: actionNames.complexTask,
    icon: <Icon name="layers" type="material" color={palette.primary} size={24} />,
    text: i18n.t('updatePlan:addComplexTask'),
    position: 2,
    color: palette.background,
    textBackground: palette.primaryVariant,
    textStyle: typography.caption,
    textElevation: 0,
    textColor: palette.textWhite,
  },
  {
    name: actionNames.interaction,
    icon: <Icon name="group" type="material" color={palette.primary} size={24} />,
    text: i18n.t('updatePlan:addInteraction'),
    position: 3,
    color: palette.background,
    textBackground: palette.primaryVariant,
    textStyle: typography.caption,
    textElevation: 0,
    textColor: palette.textWhite,
  },
  {
    name: actionNames.break,
    icon: <Icon name="notifications" type="material" color={palette.primary} size={24} />,
    text: i18n.t('updatePlan:addBreak'),
    position: 4,
    color: palette.background,
    textBackground: palette.primaryVariant,
    textStyle: typography.caption,
    textElevation: 0,
    textColor: palette.textWhite,
  },
];

interface Props {
  onPress: (name: string) => void;
}

interface State {
  actionName: string;
  isOpen: boolean;
}

export const FixedCreatePlanItemButton: FC<Props> = ({onPress}) => {
  const [state, setState] = useState<State>({
    actionName: '',
    isOpen: false,
  })

  const onPressItem = (actionName: string = actionNames.simpleTask) => {
    onPress(actionName);
  };

  const onOpen = () => {
    setState(prevState => ({
      ...prevState,
      isOpen: true
    }));
  };


  const onClose = () => {
    setState(prevState => ({
      ...prevState,
      isOpen: false
    }));
  };

  const renderFloatingIcon = () => {
    return state.isOpen ? (
      <Icon name="close" type="material" color={palette.primaryVariant} size={40} />
    ) : (
      <Icon name="add" type="material" color={palette.secondary} size={40} />
    );
  };

  return (
    <>
      {state.isOpen && <Animated.View style={[styles.overlay]} />}
      <FloatingAction
        color={state.isOpen ? palette.secondary : palette.primaryVariant}
        actions={actions}
        showBackground={false}
        onPressItem={onPressItem}
        floatingIcon={renderFloatingIcon()}
        onOpen={onOpen}
        onClose={onClose}
      />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: palette.modalBackgroundOverlay,
  },
});
