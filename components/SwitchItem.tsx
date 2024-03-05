import React, { FC } from 'react';
import { StyleSheet, Switch, View } from 'react-native';

import { dimensions, palette, typography } from '../styles';
import { StyledText } from './StyledText';

interface Props {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export const SwitchItem: FC<Props> = ({ label, value, onValueChange }) => {
  return (
    <View style={styles.container}>
      <StyledText style={styles.label}>{label}</StyledText>
      <Switch
        style={styles.switch}
        value={value}
        onValueChange={onValueChange}
        thumbColor={value ? palette.primary : palette.background}
        trackColor={{ false: palette.sliderInactive, true: palette.sliderActive }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: dimensions.spacingMedium,
    height: 40,
  },
  label: {
    ...typography.subtitle,
    color: palette.textBody,
  },
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
});
