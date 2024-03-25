import React, { useEffect, useState } from 'react';
import { BackHandler } from 'react-native';

import { NarrowScreenTemplate, StudentSettings } from '../../components';
import { i18n } from '../../locale';
import {AuthUser, Student, StudentData, StudentDisplayOption, StudentTextSizeOption} from '../../models';
import { Route } from '../../navigation';
import { NavigationProp, RouteProp } from '@react-navigation/native';

interface State {
  student: Student;
}

interface Props {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}

export const StudentCreateScreen: React.FC<Props> = ({navigation, route}) => {
  const [student, setStudent] = useState(new Student())

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonPressAndroid);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonPressAndroid);
    }
  }, []);

  const handleBackButtonPressAndroid = () => {
    if (!navigation.isFocused()) {
      return false;
    }
    return !canNavigateBack();
  };

  const createStudent = async (data: StudentData) => {
    // TODO: create new student
    const student = await Student.createStudent(data);
    // TODO: set current user
    //await AuthUser.getAuthenticatedUser().setCurrentStudent(student.id);
    navigation.navigate(Route.Dashboard, {student});
  };

  const canNavigateBack = (): boolean => {
    return route.params?.canNavigateBack !== false;
  }

  return (
    <NarrowScreenTemplate
      canNavigateBack={canNavigateBack()}
      title={i18n.t('studentSettings:createStudentTitle')}
      navigation={navigation}
    >
      <StudentSettings student={student} onStudentCreate={createStudent} />
    </NarrowScreenTemplate>
  );
}
