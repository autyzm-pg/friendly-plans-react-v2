import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { dimensions, palette, typography } from '../../styles';

interface Props {
  onPress?: () => void;
  title: string;
  buttonName: string;
  buttonType: string;
  disabled: boolean;
};

export const MultiButton: FC<Props> = ({ onPress, title, buttonName, buttonType, disabled }) => {
    const buttonColor = disabled ? palette.primaryDisabled : palette.primary;
    return (
        <Button
            onPress={onPress}
            title={title}
            icon={{
                name: buttonName,
                type: buttonType,
                color: buttonColor,
                size: 24,
                disabled: disabled,
                disabledStyle: styles.disabled
            }}
            buttonStyle={disabled ? styles.disabled : styles.button}
            titleStyle={styles.title}
            disabled={disabled}
            disabledStyle={styles.disabled}
            disabledTitleStyle={{color: palette.primaryDisabled}}
        />
    );
};

const styles = StyleSheet.create({
  button: {
    minHeight: dimensions.spacingHuge,
    backgroundColor: 'transparent',
    elevation: 0,
    height: 36,
  },
  title: {
    color: palette.primary,
    ...typography.button,
  },
  disabled: {
    backgroundColor: 'transparent'
  },
});
