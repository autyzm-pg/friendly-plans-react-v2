import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { dimensions, palette, headerHeight } from '../styles';
import { useRootNavigatorContext } from '../contexts/RootNavigatorContext';
import { IconButtonNoFeedback } from './IconButtonNoFeedback';
import { IconButton } from './IconButton';

const longPressTime = 500;

export const ModeSetting: FC = () => {
  const {editionMode, setEditionMode} = useRootNavigatorContext();

  return (
    <>
      {
        editionMode ?
        <IconButton
        name={"lock"}
        type="material"
        color={palette.textWhite}
        size={24}
        containerStyle={styles.iconContainer}
        onLongPress={() => {}}
        onPress={() => (setEditionMode())}
      />
      :
        <IconButtonNoFeedback
          name={"key"}
          type="material"
          color={palette.textDisabled}
          size={24}
          containerStyle={styles.iconContainer}
          onLongPress={() => setEditionMode()}
          delayLongPress={longPressTime}
        />
      }
      </>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    margin: dimensions.spacingSmall,
  }
});