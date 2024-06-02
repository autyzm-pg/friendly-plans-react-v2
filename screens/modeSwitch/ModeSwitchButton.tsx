import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { dimensions, palette, headerHeight } from '../../styles';
import { useRootNavigatorContext } from '../../contexts/RootNavigatorContext';
import { IconButtonNoFeedback } from '../../components/IconButtonNoFeedback';
import { IconButton } from '../../components/IconButton';
import { NavigationProp } from '@react-navigation/native';
import { Route } from '../../navigation';

const longPressTime = 500;

interface Props {
  navigation: NavigationProp<any>;
}

export const ModeSwitchButton: FC<Props> = ({navigation}) => {
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
        hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
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
          hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
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