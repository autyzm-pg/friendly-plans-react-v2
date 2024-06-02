import React, { FC, useState } from 'react';
import {
  KeyboardAvoidingView,
  StyleProp,
  StyleSheet,
  TextInput as BaseTextInput,
  TextInputProps,
  TextStyle,
} from 'react-native';

import { palette, typography } from '../styles';

interface Props extends TextInputProps {
  hideUnderline?: boolean;
  textStyle?: StyleProp<TextStyle>;
  height?: number
}

export const TextInput: FC<Props> = ({style, hideUnderline, textStyle, height=28, ...inputProps}) => {
  const [isEditable, setIsEditable] = useState<boolean>(!inputProps.value);

  const handleFocus = () => setIsEditable(true);

  const handleBlur = () => {
    if (inputProps.value) {
      setIsEditable(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        style,
        !hideUnderline && isEditable && styles.inputUnderline,
        isEditable && styles.inputBackground,
      ]}
    >
      <BaseTextInput
        style={[{ height: height, textAlignVertical: 'center' }, styles.input, textStyle, (inputProps.editable === false ) && styles.inputDisabled]}
        placeholderTextColor={palette.textInputPlaceholder}
        autoCorrect={false}
        onFocus={handleFocus}
        onBlur={handleBlur}
        selectTextOnFocus={true}
        {...inputProps}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  input: {
    ...typography.subtitle,
    paddingVertical: 1,
    color: palette.textBody,
    borderBottomColor: 'transparent',
  },
  inputUnderline: {
    borderBottomColor: palette.primary,
  },
  inputBackground: {
    backgroundColor: palette.backgroundAdditional,
  },
  inputDisabled: {
    color: palette.textDisabled,
  },
});
