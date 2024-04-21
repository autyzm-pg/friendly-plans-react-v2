import React, { FC, useState } from 'react';
import {StyleSheet} from 'react-native';

import {i18n} from '../../locale';
import {dimensions, palette, typography} from '../../styles';

import {StyledText} from '../../components/StyledText';
import {TextInput} from '../../components/TextInput';
import {NavigationProp} from '@react-navigation/native';
import { StudentSettingsButton } from '../../components/StudentSettingsButton';
import { FlatButton } from '../../components/FlatButton';
import { executeQuery } from '../../services/DatabaseService';

interface Props {
  navigation: NavigationProp<any>;
  setForgotPassword: React.Dispatch<React.SetStateAction<boolean>>
  setNewPassword: React.Dispatch<React.SetStateAction<string>>
}


export const PasswordDelete: FC<Props> = ({navigation, setForgotPassword, setNewPassword}) => {
  const factoryPassword = 'Haslo'
  const [password, setPassword] = useState('');

  const deletePassword = async () => {
    await executeQuery(`DELETE FROM Password;`);
    setNewPassword('');
    setForgotPassword(false);
  }

  const enterFactoryPassword = () => {
    return (<>
      <StyledText style={styles.label}>{i18n.t('modeSetting:regainAccess')}</StyledText>
      <TextInput
        style={styles.textInput}
        placeholder={i18n.t('modeSetting:factoryPassword')}
        value={password}
        onChangeText={(input: string) => { setPassword(input); }}
      />
      <StudentSettingsButton             
            name="check"
            type="antdesign"
            label={i18n.t('modeSetting:confirmPassword')} 
            size={24} 
            containerStyle={{height: '7%'}}
            onPress={() => {
              if(factoryPassword == password) {
                deletePassword();
              }
              else {
                setPassword(i18n.t('modeSetting:wrongPassword'));
              }
            }}
            />
      <FlatButton
          onPress={() => {setForgotPassword(false);}}
          title={i18n.t('modeSetting:retryPassword')}
          titleStyle={styles.resetPasswordTitle}
          buttonStyle={styles.resetPasswordButton}
          containerStyle={styles.resetPasswordContainer}
        />
    </>)
  }

  return (
    enterFactoryPassword()
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.headline4,
    color: palette.textSettings,
  },
  taskViewLabel: {
    marginVertical: dimensions.spacingSmall,
  },
  textInput: {
    marginTop: dimensions.spacingSmall,
    marginBottom: dimensions.spacingBig,
  },
  iconButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetPasswordTitle: {
    ...typography.body,
  },
  resetPasswordButton: {
    justifyContent: 'flex-end',
    height: 36,
  },
  resetPasswordContainer: {
    margin: dimensions.spacingTiny,
    alignSelf: 'center',
  },
});
