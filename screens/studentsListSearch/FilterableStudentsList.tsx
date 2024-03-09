import { NavigationProp } from '@react-navigation/native';
import { StudentListElement } from '../../components';
import { Student } from '../../models';
import React, {FunctionComponent} from 'react';
import { View } from 'react-native';

interface Props {
  students: Student[];
  searchQuery: string;
  navigation: NavigationProp<any>;
}

export const FilterableStudentsList: FunctionComponent<Props> = ({ students, searchQuery, navigation }) => {
  const filteredStudents: Student[] = students
    .filter(student => student.name.match(new RegExp(searchQuery, 'i')))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <View>
      {filteredStudents.map(student => (
        <StudentListElement student={student} key={student.id} navigation={navigation}/>
      ))}
    </View>
  );
};
