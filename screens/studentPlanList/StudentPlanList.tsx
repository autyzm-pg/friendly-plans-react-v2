import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
//import { NavigationInjectedProps, withNavigation } from '@react-navigation/native';

import { FullScreenTemplate } from '../../components';
import { ModelSubscriber, Plan, PlanItemType, Student } from '../../models';
import { Route } from '../../navigation';
import { EmptyStudentPlans } from './EmptyStudentPlans';
import { FixedCreatePlanButton } from './FixedCreatePlanButton';
import StudentPlanListItem from './StudentPlanListItem';
import { NavigationProp } from '@react-navigation/native';

interface Props {
  student: Student;
  navigation: NavigationProp<any>;
}

const plansList: Plan[] = [
  {
    name: "Plan 1",
    id: '111',
    studentId: '1'
  },
  {
    name: "Plan 2",
    id: '222',
    studentId: '1'
  }
]

export const StudentPlanList: React.FC<Props> = ({ student, navigation }) => {
  const [plans, setPlans] = useState<Plan[]>([]);

  const plansSubscriber: ModelSubscriber<Plan> = new ModelSubscriber();

  const subscribeToPlans = () => {
    //plansSubscriber.subscribeCollectionUpdates(student, plans => setPlans(plans));
    setPlans(plansList)
  };

  const unsubscribeFromPlans = () => {
    setPlans([])
  };

  useEffect(() => {
    subscribeToPlans();
    return () => {
      unsubscribeFromPlans();
    };
  }, []);

  const extractKey = (plan: Plan) => plan.id;

  const renderItem = ({ item }: { item: Plan }) => (
    <StudentPlanListItem plan={item} student={student} navigation={navigation}/>
  );

  const navigateTo = (name: string) => {
    if (name === 'create-plan') {
      navigation.navigate(Route.PlanActivity, {
        student,
        numberPlan: plans.length + 1,
      });
    } else if (name === 'copy-existing-plan') {
      navigation.navigate(Route.StudentsListForCopyPlan);
    }
  };

  if (!plans.length) {
    return <EmptyStudentPlans navigation={navigation}/>;
  }

  return (
    <>
      <FullScreenTemplate padded darkBackground>
        <FlatList
          data={plans}
          renderItem={renderItem}
          keyExtractor={extractKey}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          style={styles.contentContainer}
        />
      </FullScreenTemplate>
      <FixedCreatePlanButton onPress={navigateTo} />
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 12,
    width: '100%',
  },
  columnWrapper: {
    marginEnd: 12,
  },
});
