import React, { FC } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { dimensions, palette, headerHeight } from '../../styles';
import { IconButton } from '../../components/IconButton';
import { i18n } from '../../locale';

interface Props {
  changeMode: () => Promise<void>;
}

export const ModeSwitchLockButton: FC<Props> = ({changeMode}) => {
  const handlePress = () => {
    Alert.alert(
      "",
      i18n.t('header:lockEditingMessage'),
      [
        {
          text: i18n.t('header:lockEditingCancelButton'),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: i18n.t('header:lockEditingConfirmButton'),
          onPress: () => changeMode(),
        },
      ],
      {cancelable: true}
    );
  };

  return (
    <IconButton
      name={"lock"}
      type="material"
      color={palette.textWhite}
      size={24}
      hitSlop={{top: 5, bottom: 5, left: 5, right: 5}}
      containerStyle={styles.iconContainer}
      onLongPress={handlePress}
    />
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    margin: dimensions.spacingTiny,
    paddingHorizontal: 12,
    paddingVertical: 10,
  }
});