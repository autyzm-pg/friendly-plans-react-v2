import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
//import { NavigationInjectedProps, withNavigationFocus } from '@react-navigation/native';

import { i18n } from '../../locale';
import { Student, StudentDisplayOption, StudentTextSizeOption } from '../../models';
import { Route } from '../../navigation';
import { palette } from '../../styles';
import { StudentPlanList } from '../studentPlanList/StudentPlanList';
import { NavigationProp, useIsFocused } from '@react-navigation/native';

interface Props {
  navigation: NavigationProp<any>;
}

export const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const isFocused = useIsFocused();

  const [currentStudentId, setCurrentStudentId] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [nextRoute, setNextRoute] = useState<any>(null);

  //const userSubscriber: ModelSubscriber<AuthUser> = new ModelSubscriber();
  //const studentSubscriber: ModelSubscriber<Student> = new ModelSubscriber();

  useEffect(() => {
    const fetchData = async () => {
      // const user = await AuthUser.getAuthenticatedUser();
      // userSubscriber.subscribeElementUpdates(user, async (user) => {
      //   const currentStudentId = await user.getCurrentStudent();
      //   setCurrentStudentId(currentStudentId);
      // });

      // studentSubscriber.subscribeCollectionUpdates(user, async (students: Student[]) => {
      //   setStudents(students);
      //   setIsInitialized(true);
      // });
    };

    fetchData();

    return () => {
      // userSubscriber.unsubscribeElementUpdates();
      // studentSubscriber.unsubscribeCollectionUpdates();
    };
  }, []);

  useEffect(() => {
    if (!isFocused && nextRoute) {
      // @ts-ignore
      navigation.navigate(...nextRoute);
      setNextRoute(null);
    }
  }, [isFocused, nextRoute]);

  const student: Student = {
    name: "Student 1",
    displaySettings: StudentDisplayOption.ImageWithTextSlide,
    textSize: StudentTextSizeOption.Medium,
    isUpperCase: false,
    isSwipeBlocked: false,
    id: '1'
  }

  return (
    <View style={styles.container}>
      {student && <StudentPlanList student={student} navigation={navigation}/>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: palette.backgroundSurface,
  },
});

export default DashboardScreen;
