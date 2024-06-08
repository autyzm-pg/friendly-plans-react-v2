import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
//import { NavigationInjectedProps, withNavigationFocus } from '@react-navigation/native';

import { InnerGalleryService as InnerGallery, Student } from '../../models';
import { palette } from '../../styles';
import { StudentPlanList } from '../studentPlanList/StudentPlanList';
import { NavigationProp, RouteProp, useIsFocused } from '@react-navigation/native';
import { useCurrentStudentContext } from '../../contexts/CurrentStudentContext';
import DatabaseService, { createTutorialWithSamplePlans, executeQuery } from '../../services/DatabaseService';
import { useRootNavigatorContext } from '../../contexts/RootNavigatorContext';
import { Route } from '../../navigation';

interface Props {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}

export const DashboardScreen: React.FC<Props> = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  
  const {loading, setLoading, setLiteMode} = useRootNavigatorContext();
  const {currentStudent, setCurrentStudent} = useCurrentStudentContext();
  const [nextRoute, setNextRoute] = useState<any>(null);

  const connectToDatabase = async () => {
    const db = new DatabaseService();
    await db.initializeDatabase();
  }

  const getLideMode = async () => {
    const resultSet = await executeQuery(`SELECT * FROM Mode;`);
    setLiteMode(resultSet.rows.item(0).mode);
  };
  
  useEffect(() => {    
    connectToDatabase().then(() => {
      Student.getStudents().then(studentsList => {
        if (studentsList.length) {
          setCurrentStudent(studentsList[0])
        } else {
          createTutorialWithSamplePlans().then((student) => {
            if (student) {
              setCurrentStudent(student);
            } else {
              setLoading(false);
              navigation.navigate(Route.StudentCreate);
            }
          }).catch(() => {
            setLoading(false);
            navigation.navigate(Route.StudentCreate);
          })
        }
      });
    }).then(async() => await getLideMode());
    InnerGallery.createDirectory(InnerGallery.imagesDir);
    InnerGallery.createDirectory(InnerGallery.recordingsDir);
    return () => {};
  }, []);

  useEffect(() => {
    if (!isFocused && nextRoute) {
      // @ts-ignore
      navigation.navigate(...nextRoute);
      setNextRoute(null);
    }
  }, [isFocused, nextRoute]);

  return (
    <>
      {loading && 
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#262a40' />
      </View>}
      {currentStudent && 
      <View style={!loading && styles.container}>
        <StudentPlanList navigation={navigation}/>
      </View>}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: palette.backgroundSurface,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.backgroundSurface,
  },
});

export default DashboardScreen;
