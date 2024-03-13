import React, {FC} from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';

import { StyledText } from '../../components';
import { Student } from '../../models';
import { Route } from '../../navigation';
import { dimensions, palette, typography } from '../../styles';
import { NavigationProp } from '@react-navigation/native';

interface Props {
  student: Student;
  navigation: NavigationProp<any>;
}

export const StudentListElementForCopyPlan: FC<Props> = ({ student, navigation }) => {
  const navigateToPlansList = async () => {
    navigation.navigate(Route.PlansListForCopy, {
      student,
    });
  };

  return (
    <TouchableHighlight style={styles.touchable} underlayColor={palette.underlay} onPress={navigateToPlansList}>
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
