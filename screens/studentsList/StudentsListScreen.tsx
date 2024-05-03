import React, { useEffect, useState } from 'react';
import { BackHandler, StyleSheet, Text } from 'react-native';
import { IconButton, NarrowScreenTemplate } from '../../components';
import { i18n } from '../../locale';
import { Student } from '../../models';
import { Route } from '../../navigation';
import { dimensions, palette } from '../../styles';
import { StudentsList } from './StudentsList';
import { NavigationProp } from '@react-navigation/native';

interface Props {
  navigation: NavigationProp<any>;
}

export const StudentsListScreen: React.FC<Props> = ({ navigation }) => {

  const [students, setStudents] = useState<Student[]>([]);


  useEffect(() => {
    Student.getStudents().then(response => {
      setStudents(response);
    });
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonPressAndroid);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonPressAndroid);
    };
  }, []);



  const handleBackButtonPressAndroid = () => {
    if (!navigation.isFocused()) {
      return false;
    }
    return !canNavigateBack;
  };

  const navigateToStudentsSearch = () => {
    navigation.navigate(Route.StudentsListSearch, {
      students: students,
    });
  };

  const screenName = (): string => {
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

  const canNavigateBack = (): boolean => {
    return navigation.canGoBack() !== false;
  }

  return (
    <NarrowScreenTemplate
      canNavigateBack={canNavigateBack()}
      title={screenName()}
      navigation={navigation}
      buttons={renderHeaderButtons()}
    >
      <StudentsList students={students} navigation={navigation}/>
    </NarrowScreenTemplate>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    margin: dimensions.spacingTiny,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
});
