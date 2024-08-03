import React, { FC, useState } from 'react';
import {StyleSheet, View} from 'react-native';

import {i18n} from '../../locale';
import {dimensions, fonts, palette, typography} from '../../styles';

import {TextInput} from '../../components/TextInput';
import {NavigationProp} from '@react-navigation/native';
import { StudentSettingsButton } from '../../components/StudentSettingsButton';
import { FlatButton } from '../../components/FlatButton';
import { useRootNavigatorContext } from '../../contexts/RootNavigatorContext';
import { Route } from '../../navigation';
import { IconButton } from '../../components';
import { executeQuery } from '../../services/DatabaseService';

interface Props {
  navigation: NavigationProp<any>;
  password: string
  setForgotPassword: React.Dispatch<React.SetStateAction<boolean>>
}


export const PasswordEnter: FC<Props> = ({navigation, password, setForgotPassword}) => {
  const {editionMode, setEditionMode} = useRootNavigatorContext();
  const [passVis, setPassVis] = useState(false);
  const [field, setField] = useState('');

  const changeMode = async() => {
    await executeQuery(`INSERT OR REPLACE INTO EditionMode (id, editionMode) VALUES (1, (?));`, [+(!editionMode)]);
    setEditionMode(!editionMode);
  };

  const enterPassword = () => {
    return (<>
     <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          placeholder={i18n.t('modeSetting:enterPassword')}
          value={field}
          onChangeText={(input: string) => { setField(input); }}
          secureTextEntry={!passVis}
        />
        <IconButton
          name={passVis ? 'eye' : 'eye-slash'}
          type='font-awesome'
          color={palette.primary}
          size={24}
          onPress={() => {setPassVis(!passVis)}}
          style={{marginBottom: dimensions.spacingSmall, marginLeft: dimensions.spacingTiny}}
        />
      </View>
      <StudentSettingsButton
            onPress={() => {
              if(field == password) {
                changeMode();
                navigation.navigate(Route.Dashboard);
              }
              else {
                setField(i18n.t('modeSetting:wrongPassword'));
                setPassVis(true);
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
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontFamily: fonts.sansSerif.regular,
    fontSize: 16,
    letterSpacing: 0,
    color: palette.textSettings,
  },
  taskViewLabel: {
    marginVertical: dimensions.spacingSmall,
  },
  textInput: {
    marginTop: dimensions.spacingSmall,
    marginBottom: dimensions.spacingBig,
    flex: 1,
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
  iconContainer: {
    margin: dimensions.spacingSmall,
  },
});
