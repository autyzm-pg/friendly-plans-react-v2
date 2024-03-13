import React, { FC, useState, useEffect } from 'react';
import { BackHandler, StyleSheet } from 'react-native';
import { IconButton, NarrowScreenTemplate } from '../../components';
import { i18n } from '../../locale';
import { Student } from '../../models';
import { Route } from '../../navigation';
import { dimensions, palette } from '../../styles';
import { StudentsListForCopyPlan } from './StudentsListForCopyPlan';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { defaults } from '../../mocks/defaults';

interface Props {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}

export const StudentsListForCopyPlanScreen: FC<Props> = ({ navigation, route }) => {
  const [students, setStudents] = useState<Student[]>(defaults.studentsList);
  const [collections, setCollections] = useState<number[]>([]);

  useEffect(() => {
    setStudents(defaults.studentsList)
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonPressAndroid);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonPressAndroid);
    }
  }, []);

  const handleBackButtonPressAndroid = () => {
    if (!navigation.isFocused()) {
      return false;
    }
    return !getCanNavigateBack();
  };

  const navigateToStudentsSearch = () => {
    navigation.navigate(Route.StudentsListSearchForCopyPlan, {
      students: students,
    });
  };

  const getScreenName = (): string => {
    return i18n.t('studentList:screenTitle');
  }

  const handleNavigateToCreateStudent = () => {
    navigation.navigate(Route.StudentCreate);
  };

  const renderHeaderButtons = () => {
    return (
      <>
        <IconButton
          containerStyle={styles.iconContainer}
          name="person-add"
          type="material"
          size={24}
          color={palette.textWhite}
          onPress={handleNavigateToCreateStudent}
        />
        <IconButton
          containerStyle={styles.iconContainer}
          name="search"
          type="material"
          size={24}
          color={palette.textWhite}
          onPress={navigateToStudentsSearch}
        />
      </>
    );
  }

  const getCanNavigateBack = (): boolean => {
    return route.params?.canNavigateBack !== false;
  }

  return (
    <NarrowScreenTemplate
      canNavigateBack={getCanNavigateBack()}
      title={getScreenName()}
      navigation={navigation}
      buttons={renderHeaderButtons()}
    >
    <StudentsListForCopyPlan students={students} navigation={navigation} />
    </NarrowScreenTemplate>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    paddingHorizontal: dimensions.spacingSmall,
  },
});
