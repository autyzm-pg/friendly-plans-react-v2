import i18n from 'i18next';
import React, { useState } from 'react';
import {Animated, StyleSheet} from 'react-native';
import {FloatingAction} from 'react-native-floating-action';

import {Icon} from '../../components';
import {palette, typography} from '../../styles';

interface Props {
  onPress: (name: string) => void;
}

interface Action {
  name: string;
  icon: JSX.Element;
  text: string;
  position: number;
  color: string;
  textBackground: string;
  textStyle: object;
  textElevation: number;
  textColor: string;
}

const actionNames = {
  add: 'create-plan',
  copy: 'copy-existing-plan',
};

const actions: Action[] = [
  {
	  name: actionNames.add,
	  icon: <Icon name="create" type="ionicons" color={palette.primary} size={24} />,
	  text: i18n.t('planList:addPlanAction'),
	  position: 1,
	  color: palette.background,
	  textBackground: palette.primaryVariant,
	  textStyle: typography.caption,
	  textElevation: 0,
	  textColor: palette.textWhite,
  },
  {
	  name: actionNames.copy,
	  icon: <Icon name="copy" type="ionicon" color={palette.primary} size={24} />,
	  text: i18n.t('planList:copyPlanAction'),
	  position: 2,
	  color: palette.background,
	  textBackground: palette.primaryVariant,
	  textStyle: typography.caption,
	  textElevation: 0,
	  textColor: palette.textWhite,
  },
];

export const FixedCreatePlanButton: React.FC<Props> = ({ onPress }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onPressItem = (actionName: string = actionNames.add) => {
	  onPress(actionName);
  };

  const onOpen = () => {
	  setIsOpen(true);
  };

  const onClose = () => {
	  setIsOpen(false);
  };

  const renderFloatingIcon = () => {
	  return isOpen ? (
		  <Icon name="close" type="material" color={palette.primaryVariant} size={40} />
	  ) : (
		  <Icon name="add" type="material" color={palette.secondary} size={40} />
	  );
  };

  return (
	  <>
		  {isOpen && <Animated.View style={[styles.overlay]} />}
		  <FloatingAction
			  color={isOpen ? palette.secondary : palette.primaryVariant}
			  actions={actions}
			  showBackground={false}
			  onPressItem={onPressItem}
			  floatingIcon={renderFloatingIcon()}
			  onOpen={onOpen}
			  onClose={onClose}
		  />
	  </>
  );
};

const styles = StyleSheet.create({
  overlay: {
	  ...StyleSheet.absoluteFillObject,
	  backgroundColor: palette.modalBackgroundOverlay,
  },
});

export default FixedCreatePlanButton;
