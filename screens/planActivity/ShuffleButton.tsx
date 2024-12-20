import React, { FC } from 'react';
import { StyleSheet } from 'react-native';

import { i18n } from '../../locale';
import { FlatButton } from '../../components';
import { dimensions, palette } from '../../styles';

interface Props {
  disabled?: boolean;
  onPress?: () => void;
}

export const ShuffleButton: FC<Props> = ({ disabled, onPress }) => (
  <FlatButton
    title={i18n.t('planActivity:shuffleTasks')}
    icon={{
      name: 'shuffle',
      type: 'material-community-icons',
      color: disabled ? palette.shuffleTaskDisabled : palette.primary,
      size: 22,
      disabled,
      disabledStyle: styles.iconDisabled,
    }}
    disabled={disabled}
    buttonStyle={styles.button}
    onPress={onPress}
  />
);

const styles = StyleSheet.create({
  button: {
    marginRight: dimensions.spacingBig,
    minHeight: dimensions.spacingHuge
  },
  iconDisabled: {
    backgroundColor: 'transparent',
  },
});
