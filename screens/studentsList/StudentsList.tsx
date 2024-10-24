import {Separator, StudentListElement, StyledText} from '../../components';
import {sortBy} from 'lodash';
import {Student} from '../../models';
import React, {FunctionComponent, ReactElement} from 'react';
import {StyleSheet, View} from 'react-native';
import {dimensions, palette, typography} from '../../styles';
import { NavigationProp } from '@react-navigation/native';


interface Props {
  students: Student[];
  navigation: NavigationProp<any>;
}

export const StudentsList: FunctionComponent<Props> = ({ students, navigation }) => {

  const renderLetterGroupLabel = (letter: string) => (
    <StyledText key={letter} style={styles.label}>
      {letter}
    </StyledText>
  );

  const sortedStudents = sortBy(students, (student: Student) => student.name);
  const studentsLetterGrouped = sortedStudents.reduce((grouped: { [key: string]: Element[] }, student: Student) => {
    const firstLetter = student.name.charAt(0).toLowerCase();
    const shouldRenderSeparator = !grouped[firstLetter] && !!Object.keys(grouped).length;
    const studentEntry = <StudentListElement student={student} key={student.id} navigation={navigation}/>;

    grouped[firstLetter] = grouped[firstLetter]
      ? [...grouped[firstLetter], studentEntry]
      : [renderLetterGroupLabel(firstLetter), studentEntry];

    if (shouldRenderSeparator) {
      grouped[firstLetter].unshift(<Separator key={`spearator-${firstLetter}`} extraWide />);
    }
    return grouped;
  }, {});

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
