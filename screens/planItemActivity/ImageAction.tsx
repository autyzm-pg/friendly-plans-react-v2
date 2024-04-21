import React, { FC } from 'react';

import { StyledText } from '../../components';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { palette, typography } from '../../styles';

interface Props {
  children: JSX.Element;
  title: string;
  onPress: any
}

export const ImageAction: FC<Props> = ({ children, title, onPress }) => (
    <View style={styles.container}>
      <View style={styles.icon}>{children}</View>
      <TouchableOpacity onPress={onPress}>
        <StyledText style={styles.title}>{title}</StyledText>
      </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderColor: palette.backgroundSurface,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.overline,
    width: 64,
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: 8,
  },
});
