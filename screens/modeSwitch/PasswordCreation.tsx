import React, { FC, useState } from 'react';
import {StyleSheet} from 'react-native';

import {i18n} from '../../locale';
import {dimensions, palette, typography} from '../../styles';

import {StyledText} from '../../components/StyledText';
import {TextInput} from '../../components/TextInput';
import {NavigationProp} from '@react-navigation/native';
import { StudentSettingsButton } from '../../components/StudentSettingsButton';
import { executeQuery } from '../../services/DatabaseService';

interface Props {
  navigation: NavigationProp<any>;
  setNewPassword: React.Dispatch<React.SetStateAction<string>>
}

export const PasswordCreation: FC<Props> = ({navigation, setNewPassword}) => {
  const [password, setPassword] = useState('');

  const createPassword = async () => {
    await executeQuery('BEGIN TRANSACTION;');

    await executeQuery( `
    INSERT INTO Password (password)
    VALUES ((?));
    `, [
      password
    ]);
    
    const resultSet = await executeQuery(`SELECT * FROM Password ORDER BY id ASC LIMIT 1;`);
    
    if (!(resultSet.rows.length)) {
      await executeQuery('ROLLBACK;');
      throw new Error('Could not create new password')
    } else {
      await executeQuery('COMMIT;');
    }

    setNewPassword(resultSet.rows.item(0).password);  
  }

  const saveNewPassword = () => {
    return (<>
      <StyledText style={styles.label}>{i18n.t('modeSetting:createPassword')}</StyledText>
      <TextInput
        style={styles.textInput}
        placeholder={i18n.t('modeSetting:enterPassword')}
        value={password}
        onChangeText={(input: string) => { setPassword(input); }}
      />
      <StudentSettingsButton             
            name="save"
            type="antdesign"
            label={i18n.t('modeSetting:savePassword')} 
            size={24} 
            containerStyle={{height: '7%'}}
            onPress={() => {
                if(!password) { return; }
                createPassword();
            }}
            />
    </>)
  }

  return (
   saveNewPassword()
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
