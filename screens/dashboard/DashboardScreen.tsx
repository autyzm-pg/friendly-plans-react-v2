import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
//import { NavigationInjectedProps, withNavigationFocus } from '@react-navigation/native';

import { i18n } from '../../locale';
import { Student, StudentDisplayOption, StudentTextSizeOption } from '../../models';
import { Route } from '../../navigation';
import { palette } from '../../styles';
import { StudentPlanList } from '../studentPlanList/StudentPlanList';
import { NavigationProp, RouteProp, useIsFocused } from '@react-navigation/native';
import { useCurrentStudentContext } from '../../contexts/CurrentStudentContext';
import DatabaseService from '../../services/DatabaseService';

interface Props {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}

export const DashboardScreen: React.FC<Props> = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  
  const {currentStudent, setCurrentStudent} = useCurrentStudentContext();
  const [nextRoute, setNextRoute] = useState<any>(null);

  const connectToDatabase = async () => {
    const db = new DatabaseService();
    await db.initializeDatabase();
  }

  useEffect(() => {
    
    connectToDatabase().then(() => {
      Student.getStudents().then(studentsList => {
        if (studentsList.length)
          setCurrentStudent(studentsList[0])
      })
    });

    return () => {

    };
  }, []);

  useEffect(() => {
    if (!isFocused && nextRoute) {
      // @ts-ignore
      navigation.navigate(...nextRoute);
      setNextRoute(null);
    }
  }, [isFocused, nextRoute]);

  return (
    <View style={styles.container}>
      {currentStudent && <StudentPlanList navigation={navigation}/>}
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
