import React, {FC} from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, FullScreenTemplate, StyledText } from '../../components';
import { i18n } from '../../locale';
import { Route } from '../../navigation/routes';
import { palette, typography } from '../../styles';

import { SignInBackground } from './SignInBackground';
import { SignInFormContainer } from './SignInFormContainer';
import { NavigationProp, useNavigation } from '@react-navigation/native';

interface Props {
  navigation: NavigationProp<any>;
}

export const SignInScreen: FC<Props> = ({navigation}) => {
  const navigateToSignUp = (): void => navigation.navigate(Route.SignUp);

  return (
    <FullScreenTemplate padded extraStyles={styles.fullScreen}>
      <SignInBackground />
      <View style={styles.container}>
        <StyledText style={styles.title}>{i18n.t('rest:title')}</StyledText>
        <SignInFormContainer />
        <Button
          onPress={() => navigation.navigate(Route.Dashboard)}
          title={i18n.t('signUp:signUp')}
          containerStyle={styles.buttonContainer}
          titleStyle={styles.titleButton}
          backgroundColor={palette.background}
          buttonStyle={styles.button} 
          isUppercase={undefined} 
          icon={undefined}        
        />
      </View>
    </FullScreenTemplate>
  );
}

const styles = StyleSheet.create({
  container: { width: 272, marginHorizontal: 'auto', alignSelf: 'center' },
  signUpTip: {
    ...typography.caption,
    color: palette.textDisabled,
    textAlign: 'center',
    marginTop: 4,
  },
  anonymousTip: {
    ...typography.caption,
    color: palette.textDisabled,
    textAlign: 'center',
    marginTop: 20,
  },
  fullScreen: {
    backgroundColor: palette.welcomeBackground,
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 20,
  },
  button: {
    borderRadius: 12,
    height: 44,
  },
  title: {
    color: palette.primary,
    fontSize: 48,
    marginBottom: 48,
  },
  titleButton: {
    color: palette.primary,
  },
});
