import React, { FC, useState } from 'react';
import { Alert } from 'react-native';

import { NarrowScreenTemplate, StudentSettings } from '../../components';
import { i18n } from '../../locale';
import { NavigationProp } from '@react-navigation/native';
import { Student, StudentData, StudentDisplayOption, StudentTextSizeOption } from '../../models';

interface Props {
  navigation: NavigationProp<any>;
  student?: Student /* TODO: Student parameter shoudn't be optional. */
}

const defaultStudent: StudentData = {
  name: "Student 1",
  displaySettings: StudentDisplayOption.ImageWithTextSlide,
  textSize: StudentTextSizeOption.Medium,
  isUpperCase: false,
  isSwipeBlocked: false
}

export const StudentSettingsScreen: FC<Props> = ({navigation, student}) => {
  const [state, setState] = useState<StudentData>(defaultStudent)

  const getScreenName = () => {
    return i18n.t('studentSettings:settingsTitle', {
      studentName: state.name,
    });
  };

  // TODO: Handling removing students and personal data updates from database side.

  const removeStudent = async () => {
    // await AuthUser.getAuthenticatedUser().setCurrentStudent('');
    // await this.state.student.delete();
    navigation.goBack();
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
    // ...
    setState(updated);
  }

  return (
    <NarrowScreenTemplate title={getScreenName()} navigation={navigation}>
      <StudentSettings
        student={defaultStudent}
        onStudentRemove={handleRemoveStudentPressed}
        onStudentUpdate={updateStudent}
      />
    </NarrowScreenTemplate>
  );
}
