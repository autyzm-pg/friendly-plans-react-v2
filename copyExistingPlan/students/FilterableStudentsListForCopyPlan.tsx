import { Student } from 'models';
import React, {FunctionComponent} from 'react';
import { View } from 'react-native';
import {StudentListElementForCopyPlan} from './StudentListElementForCopyPlan';

interface Props {
  students: Student[];
  searchQuery: string;
}

export const FilterableStudentsListForCopyPlan: FunctionComponent<Props> = ({ students, searchQuery }) => {
  const filteredStudents: Student[] = students
    .filter(student => student.collectionCount > 0 && student.name.match(new RegExp(searchQuery, 'i')))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <View>
      {filteredStudents.map(student => (
        <StudentListElementForCopyPlan student={student} key={student.id} />
      ))}
    </View>
  );
};
