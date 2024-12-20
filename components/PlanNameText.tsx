import React, { FC } from 'react';
import { StyleSheet } from 'react-native';

import { StyledText } from '../components';
import { palette, typography } from '../styles';

interface Props {
  planName: string;
  textSize: string;
  isUpperCase?: boolean;
  isSettingsPreview?: boolean;
  alignTextCenter?: boolean;
}

const planNameTypography: Record<string, any> = {
  studentView: {
    xl: typography.headline1,
    l: typography.headline2,
    m: typography.headline3,
    s: typography.headline4,
  },
  settingsPreview: {
    xl: typography.headline3Prev,
    l: typography.headline4Prev,
    m: typography.headline5,
    s: typography.headline6,
  },
};

export const PlanNameText: FC<Props> = ({
  planName,
  textSize,
  isUpperCase = false,
  isSettingsPreview = false,
  ...props
}) => {
  const getTypography = () => {
    if (isSettingsPreview) {
      return planNameTypography.settingsPreview[textSize];
    }

    return planNameTypography.studentView[textSize];
  };

  const getPlanDisplayName = () => (isUpperCase ? planName.toUpperCase() : planName);

  return <StyledText style={[
    styles.planNameText, 
    props.alignTextCenter ? styles.textAlignCenter : styles.textAlignLeft, 
    getTypography()
  ]}>
    {getPlanDisplayName()}
  </StyledText>;
};

const styles = StyleSheet.create({
  planNameText: {
    color: palette.textBody,
    textAlign: 'left',
    paddingBottom: 32,
    paddingTop: 16
  },
  textAlignLeft: {
    textAlign: 'left',
  },
  textAlignCenter: {
    textAlign: 'center',
  },
});
