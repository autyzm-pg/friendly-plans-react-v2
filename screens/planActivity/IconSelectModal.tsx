import { noop } from 'lodash';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
//import { NavigationInjectedProps, withNavigation } from '@react-navigation/native';
import { dimensions } from '../../styles';

import { EMOJIS_LIST } from '../../assets/emojis';
import { EmojiButton } from './EmojiButton';
import { NavigationProp } from '@react-navigation/native';

interface Props {
  onEmojiSelect: (emoji: string) => void;
  closeModal?: () => void;
  navigation: NavigationProp<any>
}

const IconSelectModalBase: FC<Props> = ({ closeModal = noop, onEmojiSelect, navigation }) => {
  const onEmojiPress = (emoji: string) => {
    onEmojiSelect(emoji);
    closeModal();
  };

  const renderEmojiButtons = () =>
    EMOJIS_LIST.map((emoji, index) => {
      return <EmojiButton key={index} emoji={emoji} onPress={onEmojiPress} />;
    });

  return <View style={styles.container}>{renderEmojiButtons()}</View>;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: dimensions.spacingSmall,
  },
});

export const IconSelectModal = IconSelectModalBase;
