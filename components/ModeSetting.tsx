import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { dimensions, palette } from '../styles';
import { IconButton } from './IconButton';
import { useRootNavigatorContext } from '../contexts/RootNavigatorContext';

interface Props {
}

const emptyComb = {
  short: 0,
  long: 0
}
const longPressTime = 2000;

export const ModeSetting: FC<Props> = () => {
  const [combination, setCombination] = useState(emptyComb)
  const {editionMode, setEditionMode} = useRootNavigatorContext();

  /*
    [editionMode: false] [child view]
    Press short -> long -> short combination with one finger and then tap short once with two fingers to change to edition mode.
      - After some time, defined in useEffect, combination will be reseted.
      - If pressed shortly multiple times, one can also long press to reset combination.
    
    [editionMode: true] [therapist / caregiver view]
    Press shortly once to change to play mode.

    SHIFT + CTRL for multi touch test (Android).
  */

  useEffect(() => {
    const timer = setTimeout(() => {
      setCombination(emptyComb);
    }, longPressTime*5);
    // console.log(combination);
    return () => clearTimeout(timer);
  }, [combination])

  const handleShortPressUnlock = () => {
    setCombination(prevState => ({
      ...prevState,
      short: combination.short + 1
    }));
  }

  const handleLongPressUnlock = () => {    
    if ((combination.short === 1 && combination.long === 0)) {
      setCombination(prevState => ({
        ...prevState,
        long: combination.long + 1
      }));
    }
    else {
      setCombination(emptyComb)
    }
  }

  return (
    <View onStartShouldSetResponder={(event) => {
      if (event.nativeEvent.touches.length === 2) {
        return true;
      }
      return false;
    }}
    onResponderRelease={() => {
      if (combination.short === 2 && combination.long === 1) {
        setCombination(emptyComb)
        setEditionMode();
      }
    }}
    >
      <IconButton
        name={editionMode ? "lock": "key"}
        type="material"
        color={palette.textWhite}
        size={24}
        containerStyle={styles.iconContainer}
        onLongPress={editionMode ? () => {} : handleLongPressUnlock}
        onPress={editionMode ? () => (setEditionMode()) : handleShortPressUnlock}
        delayLongPress={longPressTime}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    margin: dimensions.spacingSmall,
  }
});