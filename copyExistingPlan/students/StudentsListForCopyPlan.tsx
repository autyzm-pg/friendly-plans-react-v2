import {Separator, StyledText} from '../../components';
import {Student} from '../../models';
import React, {FC, ReactElement, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {dimensions, palette, typography} from '../../styles';
import {StudentListElementForCopyPlan} from './StudentListElementForCopyPlan';
import { NavigationProp } from '@react-navigation/native';
import { Alert } from 'react-native';
import { i18n } from '../../locale';

interface Props {
  students: Student[];
  navigation: NavigationProp<any>;
};

export const StudentsListForCopyPlan: FC<Props> = ({navigation, students}) => {
  const [sortedStudents, setSortedStudents] = useState<Student[]>([]);

  const renderLetterGroupLabel = (letter: string) => (
    <StyledText key={letter} style={styles.label}>
      {letter}
    </StyledText>
  );

  useEffect(() => {
    getFilteredStudents();
  }, [students]);

  const getFilteredStudents = async () => {
    const filteredList = [] as Student[];
    for (const student of students) {
      const planCount = await Student.getPlansCount(student.id);
      if (planCount <= 0) { continue; }
      filteredList.push(student);
    }
    setSortedStudents(filteredList.sort((studentA: Student, studentB: Student) => studentA.name > studentB.name ? 1 : -1));
  };

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
      [{ text: 'OK', onPress: () => {} }]
    );
  }

  return (
    sortedStudents.length > 0 
    ?
    <View>
      {Object.values(studentsLetterGrouped).flat() as ReactElement[]}
    </View>
    :
    <StyledText>
      {i18n.t('forCopy:noPlans')}
    </StyledText>
  );
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
