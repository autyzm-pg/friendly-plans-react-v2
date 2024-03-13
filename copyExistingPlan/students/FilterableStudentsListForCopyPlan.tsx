import { Student } from '../../models';
import React, { FC } from 'react';
import { View } from 'react-native';
import { StudentListElementForCopyPlan } from './StudentListElementForCopyPlan';
import { NavigationProp } from '@react-navigation/native';

interface Props {
  students: Student[];
  searchQuery: string;
  navigation: NavigationProp<any>;
}

export const FilterableStudentsListForCopyPlan: FC<Props> = ({ students, searchQuery, navigation }) => {
  const filteredStudents: Student[] = students
    .filter(student => student.collectionCount > 0 && student.name.match(new RegExp(searchQuery, 'i')))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <View>
      {filteredStudents.map(student => (
        <StudentListElementForCopyPlan student={student} key={student.id} navigation={navigation} />
      ))}
    </View>
  );
};
