import React, { FC, useEffect, useState } from 'react';
import { i18n } from '../../locale';

import { NavigationProp } from '@react-navigation/native';
import { executeQuery } from '../../services/DatabaseService';
import { NarrowScreenTemplate, StyledText } from '../../components';
import { PasswordEnter } from './PasswordEnter'
import { PasswordDelete } from './PasswordDelete'
import { PasswordCreation } from './PasswordCreation';
import { typography } from '../../styles';

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
  }

  useEffect(() => {
    getPassword();
  }, [])

  return (
    <NarrowScreenTemplate title={getScreenName()} navigation={navigation}>
        {loading && <StyledText style={{...typography.headline4}}>{'Loading...'}</StyledText>}
        {!loading && password && !forgotPassword && <PasswordEnter navigation={navigation} password={password} setForgotPassword={setForgotPassword}/>}
        {!loading && password && forgotPassword && <PasswordDelete navigation={navigation} setForgotPassword={setForgotPassword} setNewPassword={setPassword}/>}
        {!loading && !password && <PasswordCreation navigation={navigation} setNewPassword={setPassword}/>}
    </NarrowScreenTemplate>
  );
}
