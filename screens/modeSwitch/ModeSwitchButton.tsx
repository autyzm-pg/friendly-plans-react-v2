import React, { FC } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { dimensions, palette, headerHeight } from '../../styles';
import { useRootNavigatorContext } from '../../contexts/RootNavigatorContext';
import { IconButtonNoFeedback } from '../../components/IconButtonNoFeedback';
import { IconButton } from '../../components/IconButton';
import { NavigationProp } from '@react-navigation/native';
import { Route } from '../../navigation';
import { executeQuery } from '../../services/DatabaseService';
import { ModeSwitchLockButton } from "./ModeSwitchLockButton.tsx";

const longPressTime = 500;

interface Props {
  navigation: NavigationProp<any>;
}

export const ModeSwitchButton: FC<Props> = ({navigation}) => {
  const {editionMode, setEditionMode} = useRootNavigatorContext();

  const changeMode = async () => {
    await executeQuery(`INSERT OR REPLACE INTO EditionMode (id, editionMode) VALUES (1, (?));`, [+(!editionMode)]);
    setEditionMode(!editionMode);
  };

  return (
    <>
      {
        editionMode ?
          <ModeSwitchLockButton changeMode={changeMode}/>
          :
          <IconButtonNoFeedback
            name={"key"}
            type="material"
            color={palette.textDisabled}
            size={24}
            hitSlop={{top: 5, bottom: 5, left: 5, right: 5}}
            containerStyle={styles.iconContainer}
            onLongPress={() => {
              navigation.navigate(Route.ModeSwitch);
            }}
            delayLongPress={longPressTime}
          />
      }
    </>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    margin: dimensions.spacingTiny,
    paddingHorizontal: 12,
    paddingVertical: 10,
  }
});