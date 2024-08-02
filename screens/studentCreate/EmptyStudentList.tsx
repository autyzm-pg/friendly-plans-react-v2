import React from 'react';
import { StyleSheet, View } from 'react-native';
import { palette } from '../../styles';

import { Route } from '../../navigation';
import { NavigationProp } from '@react-navigation/native';
import { useRootNavigatorContext } from '../../contexts/RootNavigatorContext';
import { DashboardBackground } from '../studentPlanList/DashboardBackground';
import { Button } from '../../components/Button';
import { i18n } from '../../locale';

interface Props {
  navigation: NavigationProp<any>;
}

export const EmptyStudentList: React.FC<Props> = ({ navigation }) => {
  const  { editionMode } = useRootNavigatorContext();

  const navigateToCreateNewStudent = async () => {
    navigation.navigate(Route.StudentCreate);
  };

  return (
    <View style={styles.container}>
      <DashboardBackground />
      {editionMode && <>
        <Button
            title={i18n.t('studentList:createStudent')}
            icon={{
              name: 'addfile',
              type: 'antdesign',
              color: palette.textWhite,
              size: 13,
          }}
          isUppercase
          onPress={navigateToCreateNewStudent}
        />
      </>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.backgroundSurface,
  },
  text: {
    color: palette.primaryLight,
  },
});
