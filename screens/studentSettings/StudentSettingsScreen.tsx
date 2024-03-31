import React, { FC, useState } from 'react';
import { Alert } from 'react-native';

import { NarrowScreenTemplate, StudentSettings } from '../../components';
import { i18n } from '../../locale';
import { NavigationProp } from '@react-navigation/native';
import { Student, StudentData } from '../../models';

import { defaults } from "../../mocks/defaults"
import { useCurrentStudentContext } from '../../contexts/CurrentStudentContext';
import { Route } from '../../navigation';

interface Props {
  navigation: NavigationProp<any>;
}

export const StudentSettingsScreen: FC<Props> = ({navigation}) => {
  const [state, setState] = useState<StudentData>(defaults.student as StudentData);
  const {currentStudent, setCurrentStudent} = useCurrentStudentContext();

  const getScreenName = () => {
    return i18n.t('studentSettings:settingsTitle', {
      studentName: state.name,
    });
  };


  const removeStudent = async () => {

    if (currentStudent) {
      await Student.deleteStudent(currentStudent)
  
      const firstStudent = await Student.getFirstStudent()
      setCurrentStudent(firstStudent)
    }
    navigation.goBack();
    // TODO: remove if there is no need to choose another student
    navigation.navigate(Route.StudentsList);
  }

  const handleRemoveStudentPressed = () => {
    Alert.alert(
      i18n.t('studentSettings:deleteStudent'),
      i18n.t('studentSettings:deleteMessage'),
      [
        { text: i18n.t('studentSettings:cancel') },
        { text: i18n.t('studentSettings:delete'), onPress: removeStudent },
      ],
      { cancelable: false },
    );
  };

  const updateStudent = (updated: StudentData) => {
    // TODO: updating students
    setState(updated);
  }

  return (
    <NarrowScreenTemplate title={getScreenName()} navigation={navigation}>
      <StudentSettings
        student={currentStudent as StudentData}
        onStudentRemove={handleRemoveStudentPressed}
        onStudentUpdate={updateStudent}
      />
    </NarrowScreenTemplate>
  );
}
