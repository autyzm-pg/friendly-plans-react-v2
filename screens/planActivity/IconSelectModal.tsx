import { noop } from 'lodash';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { dimensions } from '../../styles';

import { EMOJIS_LIST } from '../../assets/emojis';
import { EmojiButton } from './EmojiButton';

interface Props {
  onEmojiSelect: (emoji: string) => void;
  closeModal?: () => void;
}

export const IconSelectModal: FC<Props> = ({ closeModal = noop, onEmojiSelect }) => {
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
