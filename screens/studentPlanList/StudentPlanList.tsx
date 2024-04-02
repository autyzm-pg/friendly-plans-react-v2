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
import { defaults } from '../../mocks/defaults';
import { useRootNavigatorContext } from '../../contexts/RootNavigatorContext';
import { useCurrentStudentContext } from '../../contexts/CurrentStudentContext';

interface Props {
  navigation: NavigationProp<any>;
}

export const StudentPlanList: React.FC<Props> = ({ navigation }) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const {editionMode} = useRootNavigatorContext();
  const {currentStudent} = useCurrentStudentContext();

  const plansSubscriber: ModelSubscriber<Plan> = new ModelSubscriber();

  const subscribeToPlans = async () => {
    //plansSubscriber.subscribeCollectionUpdates(student, plans => setPlans(plans));
    if (currentStudent) {
      const plans = await Plan.getPlans(currentStudent.id);
      setPlans(plans)
    }
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
    <StudentPlanListItem plan={item} navigation={navigation}/>
  );

  const navigateTo = (name: string) => {
    if (name === 'create-plan') {
      navigation.navigate(Route.PlanActivity, {
        currentStudent,
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
      {editionMode && <FixedCreatePlanButton onPress={navigateTo} />}
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
