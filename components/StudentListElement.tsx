import React, { FC } from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';

import { StyledText } from '../components';
import { AuthUser, Student } from '../models';
import { Route } from '../navigation';
import { dimensions, palette, typography } from '../styles';
import { NavigationProp } from '@react-navigation/native';

interface Props {
  student: Student;
  navigation: NavigationProp<any>;
}

export const StudentListElement: FC<Props> = ({ student, navigation }) => {
  const setCurrentStudent = async () => {
    // TODO: Setting current user
    // await AuthUser.getAuthenticatedUser().setCurrentStudent(student.id);
    navigation.navigate(Route.Dashboard, {
      student,
    });
  };

  return (
    <TouchableHighlight style={styles.touchable} underlayColor={palette.underlay} onPress={setCurrentStudent}>
      <StyledText style={styles.studentName}>{student.name}</StyledText>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  touchable: {
    marginHorizontal: -dimensions.spacingBig,
    paddingHorizontal: dimensions.spacingBig,
  },
  studentName: {
    ...typography.subtitle,
    color: palette.textBody,
    marginTop: dimensions.spacingSmall,
    marginBottom: dimensions.spacingSmall,
  },
});
