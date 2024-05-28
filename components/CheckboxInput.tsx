import React, { FC } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { dimensions, palette, typography } from '../styles';
import { IconButton } from './IconButton';
import { StyledText } from './StyledText';
import { Icon } from 'react-native-elements';

export const icons = {
  checked: 'checkbox-marked',
  unchecked: 'checkbox-blank-outline',
};

interface Props {
  checked: boolean;
  onPress: (value: boolean) => void;
  title?: string;
  children?: JSX.Element;
  error?: string;
  hitSlope?: any;
}

export const CheckboxInput: FC<Props> = ({checked, onPress, title, children, error, hitSlope={ top: 25, bottom: 25, left: 25, right: 25 }}) => {
  const handleOnPress = () => {
    onPress(!checked);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.container}
                        onPress={handleOnPress} 
                        hitSlop={hitSlope}>
        <Icon 
          name={checked ? icons.checked : icons.unchecked}
          type = 'material-community'
          containerStyle={styles.iconContainer}
          color={palette.primary}
        />
        {title && (
          <View style={[styles.contentContainer]}>
            <StyledText style={styles.label}>{title}</StyledText>
            {children}
          </View>
        )}
      </TouchableOpacity>
      {!!error && (
        <View style={styles.errorContainer}>
          <StyledText style={styles.error}>{error}</StyledText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    color: palette.textBlack,
  },
  iconContainer: {
    alignItems: 'flex-start',
    marginRight: 2
  },
  errorContainer: {
    height: 20,
    alignItems: 'flex-start',
  },
  error: {
    ...typography.caption,
    color: palette.error,
  },
});
