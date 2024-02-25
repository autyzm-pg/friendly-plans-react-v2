import React, {FC} from 'react';
import { StyleSheet } from 'react-native';

import { FullScreenTemplate } from '../../components';

import { palette } from '../../styles';
import { SignUpBackground } from './SignUpBackground';
import { SignUpFormContainer } from './SignUpFormContainer';

export const SignUpScreen: FC<{}> = () => (
  <>
    <FullScreenTemplate padded narrow extraStyles={styles.fullScreen}>
      <SignUpFormContainer />
    </FullScreenTemplate>
    <SignUpBackground />
  </>
)

const styles = StyleSheet.create({
  fullScreen: {
    backgroundColor: palette.welcomeBackground,
    paddingVertical: 37,
  },
});
