import React, { FC } from 'react';
import { StyleProp, StyleSheet, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import { IconProps } from 'react-native-elements';
import { Icon } from './Icon';
import { dimensions } from '../styles';

interface Props extends IconProps {
  label?: string;
  color?: string;
  iconButtonStyle?: StyleProp<ViewStyle>;
}

export const IconButtonNoFeedback: FC<Props> = ({ 
  delayLongPress, 
  onLongPress,                                 
  onPress, 
  containerStyle,  
  label, 
  disabled, 
  iconButtonStyle,
  hitSlop,
  ...props 
}) => {
  return (
    <TouchableWithoutFeedback 
      disabled={disabled} 
      delayLongPress={delayLongPress}
      onLongPress={onLongPress} 
      onPress={onPress}
      style={[styles.container, containerStyle, iconButtonStyle]}
      touchSoundDisabled={true}
      hitSlop={hitSlop}
    >
      <View>
        <Icon {...props} disabledStyle={styles.iconDisabled} style={{ marginRight: dimensions.spacingSmall }}/>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconDisabled: {
    backgroundColor: 'transparent',
  },
});

IconButtonNoFeedback.displayName = 'IconButtonNoFeedback';
