import React, { FC, useEffect, useState } from 'react';
import { i18n } from '../../locale';

import { NavigationProp } from '@react-navigation/native';
import { executeQuery } from '../../services/DatabaseService';
import { NarrowScreenTemplate } from '../../components';
import { PasswordEnter } from './PasswordEnter'
import { PasswordDelete } from './PasswordDelete'
import { PasswordCreation } from './PasswordCreation';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

interface Props {
  navigation: NavigationProp<any>;
}


export const ModeSwitchScreen: FC<Props> = ({navigation}) => {
  const getScreenName = () => {
    return i18n.t('modeSetting:title')
  };

  const [password, setPassword] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  const getPassword = async () => {
    const resultSet = await executeQuery(`SELECT * FROM Password ORDER BY id ASC LIMIT 1;`);
    if (!(resultSet.rows.length)) {
      setLoading(false);
      return;
    }
    setPassword(resultSet.rows.item(0).password);
    setLoading(false);
  };

  useEffect(() => {
    getPassword();
  }, []);

  return (
    <NarrowScreenTemplate title={getScreenName()} navigation={navigation}>
        {loading &&
          <View style={styles.loadingContainer}>
            <ActivityIndicator size='large' color='#262a40' />
          </View>
        }
        {!loading && password && !forgotPassword && <PasswordEnter navigation={navigation} password={password} setForgotPassword={setForgotPassword}/>}
        {!loading && password && forgotPassword && <PasswordDelete navigation={navigation} setForgotPassword={setForgotPassword} setNewPassword={setPassword}/>}
        {!loading && !password && <PasswordCreation navigation={navigation} setNewPassword={setPassword}/>}
    </NarrowScreenTemplate>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});