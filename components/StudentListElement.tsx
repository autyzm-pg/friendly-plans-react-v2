import React, { FC } from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';

import { StyledText } from '../components';
import { AuthUser, Student } from '../models';
import { Route } from '../navigation';
import { dimensions, palette, typography } from '../styles';
import { NavigationProp } from '@react-navigation/native';
import { useCurrentStudentContext } from '../contexts/CurrentStudentContext';

interface Props {
  student: Student;
  navigation: NavigationProp<any>;
}

export const StudentListElement: FC<Props> = ({ student, navigation }) => {
  const {setStudent} = useCurrentStudentContext();

  const setCurrentStudent = async () => {
    setStudent(student);
    navigation.navigate(Route.Dashboard);
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
