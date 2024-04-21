import React, { FC, useState } from 'react';
import {StyleSheet} from 'react-native';

import {i18n} from '../../locale';
import {dimensions, palette, typography} from '../../styles';

import {TextInput} from '../../components/TextInput';
import {NavigationProp} from '@react-navigation/native';
import { StudentSettingsButton } from '../../components/StudentSettingsButton';
import { FlatButton } from '../../components/FlatButton';
import { useRootNavigatorContext } from '../../contexts/RootNavigatorContext';
import { Route } from '../../navigation';

interface Props {
  navigation: NavigationProp<any>;
  password: string
  setForgotPassword: React.Dispatch<React.SetStateAction<boolean>>
}


export const PasswordEnter: FC<Props> = ({navigation, password, setForgotPassword}) => {
  const {editionMode, setEditionMode} = useRootNavigatorContext();
  const [field, setField] = useState('');

  const enterPassword = () => {
    return (<>
      <TextInput
        style={styles.textInput}
        placeholder={i18n.t('modeSetting:enterPassword')}
        value={field}
        onChangeText={(input: string) => { setField(input); }}
      />
      <StudentSettingsButton
            onPress={() => {
              if(field == password) {
                setEditionMode();
                navigation.navigate(Route.Dashboard);
              }
              else {
                setField(i18n.t('modeSetting:wrongPassword'));
              }
            }}             
            name="check"
            type="antdesign"
            label={i18n.t('modeSetting:confirmPassword')} 
            size={24} 
            containerStyle={{height: '7%'}}/>
      <FlatButton
          onPress={() => {
            setForgotPassword(true);
          }}
          title={i18n.t('modeSetting:forgotPassword')}
          titleStyle={styles.resetPasswordTitle}
          buttonStyle={styles.resetPasswordButton}
          containerStyle={styles.resetPasswordContainer}
        />

    </>)
  }

  return (
    enterPassword()
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
