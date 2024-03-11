import {Separator, StyledText} from '../../components';
import {sortBy} from 'lodash';
import {Student} from '../../models';
import React, {FC, ReactElement, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {dimensions, palette, typography} from '../../styles';
import {StudentListElementForCopyPlan} from './StudentListElementForCopyPlan';
import { NavigationProp } from '@react-navigation/native';
import { Alert } from 'react-native';

interface Props {
  students: Student[];
  navigation: NavigationProp<any>;
}

export const StudentsListForCopyPlan: FC<Props> = ({navigation, students}) => {
  const renderLetterGroupLabel = (letter: string) => (
    <StyledText key={letter} style={styles.label}>
      {letter}
    </StyledText>
  );


  const filteredStudents = students.filter(student => student.collectionCount > 0);

  const sortedStudents = sortBy(filteredStudents, (student: Student) => student.name);
  
  const studentsLetterGrouped = sortedStudents.reduce((grouped: { [key: string]: Element[] }, student: Student) => {
    const firstLetter = student.name.charAt(0).toLowerCase();
    const shouldRenderSeparator = !grouped[firstLetter] && !!Object.keys(grouped).length;

    const studentEntry = <StudentListElementForCopyPlan student={student} key={student.id} navigation={navigation}/>;

    grouped[firstLetter] = grouped[firstLetter]
      ? [...grouped[firstLetter], studentEntry]
      : [renderLetterGroupLabel(firstLetter), studentEntry];

    if (shouldRenderSeparator) {
      grouped[firstLetter].unshift(<Separator key={`spearator-${firstLetter}`} extraWide />);
    }

    return grouped;
  }, {});

  if (students.length === 0) {
    Alert.alert(
      'Empty Student List',
      'There are no students to display.',
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
    );
  }

  return <View>{Object.values(studentsLetterGrouped).flat() as ReactElement[]}</View>;
};

const styles = StyleSheet.create({
  label: {
    ...typography.overline,
    color: palette.textDisabled,
    textTransform: 'uppercase',
  },
  studentName: {
    ...typography.subtitle,
    color: palette.textBody,
    marginTop: dimensions.spacingSmall,
    marginBottom: dimensions.spacingSmall,
  },
});
