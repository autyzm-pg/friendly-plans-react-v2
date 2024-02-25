import {Separator, StyledText} from 'components';
import {sortBy} from 'lodash';
import {Student} from 'models';
import React, {FunctionComponent} from 'react';
import {StyleSheet, View} from 'react-native';
import {dimensions, palette, typography} from 'styles';
import {StudentListElementForCopyPlan} from './StudentListElementForCopyPlan';


interface Props {
  students: Student[];
}



export const StudentsListForCopyPlan: FunctionComponent<Props> = ({ students}) => {


  const renderLetterGroupLabel = (letter: string) => (
    <StyledText key={letter} style={styles.label}>
      {letter}
    </StyledText>
  );


  const filteredStudents = students.filter((student) => {
    if(student.collectionCount > 0){
      return 1;
    } else {
      return 0;
    }
  });

  const sortedStudents = sortBy(filteredStudents, (student: Student) => student.name);
  const studentsLetterGrouped = sortedStudents.reduce((grouped: { [key: string]: Element[] }, student: Student) => {
    const firstLetter = student.name.charAt(0).toLowerCase();
    const shouldRenderSeparator = !grouped[firstLetter] && !!Object.keys(grouped).length;

    const studentEntry = <StudentListElementForCopyPlan student={student} key={student.id}/>;

    grouped[firstLetter] = grouped[firstLetter]
      ? [...grouped[firstLetter], studentEntry]
      : [renderLetterGroupLabel(firstLetter), studentEntry];

    if (shouldRenderSeparator) {
      grouped[firstLetter].unshift(<Separator key={`spearator-${firstLetter}`} extraWide />);
    }

    return grouped;
  }, {});

  return <View>{Object.values(studentsLetterGrouped).flat()}</View>;
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
