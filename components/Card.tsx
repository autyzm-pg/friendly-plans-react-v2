import React, {FC} from 'react';
import {
  RegisteredStyle,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import {dimensions, getElevation, palette} from '../styles';

interface Props {
  children?: React.ReactNode;
  style?: RegisteredStyle<ViewStyle> | ViewStyle | StyleProp<ViewStyle>;
}

export const Card: FC<Props> = ({style, children}) => {
  return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    ...getElevation(2),
    borderRadius: dimensions.spacingSmall,
    backgroundColor: palette.background,
    paddingVertical: dimensions.spacingSmall,
    paddingHorizontal: dimensions.spacingBig,
  },
});
