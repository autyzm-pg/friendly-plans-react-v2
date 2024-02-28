import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import { palette } from '../styles';

interface Props {
  symbol: string;
}

export const Emoji: React.FC<Props> = ({ symbol }) => {
  return (<Text style={styles.emoji}>{symbol}</Text>);
}

const styles = StyleSheet.create({
  emoji: {
    fontSize: 24,
    color: palette.textWhite,
  },
});
