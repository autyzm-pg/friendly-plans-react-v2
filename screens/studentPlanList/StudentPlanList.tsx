import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
//import { NavigationInjectedProps, withNavigation } from '@react-navigation/native';

import { FullScreenTemplate } from '../../components';
import { ModelSubscriber, Plan, PlanItemType, Student } from '../../models';
import { Route } from '../../navigation';
import { EmptyStudentPlans } from './EmptyStudentPlans';
import { FixedCreatePlanButton } from './FixedCreatePlanButton';
import StudentPlanListItem from './StudentPlanListItem';
import { NavigationProp, useIsFocused } from '@react-navigation/native';
import { defaults } from '../../mocks/defaults';
import { useRootNavigatorContext } from '../../contexts/RootNavigatorContext';
import { useCurrentStudentContext } from '../../contexts/CurrentStudentContext';

interface Props {
  navigation: NavigationProp<any>;
}

export const StudentPlanList: React.FC<Props> = ({ navigation }) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const {editionMode, loading, setLoading} = useRootNavigatorContext();
  const {currentStudent} = useCurrentStudentContext();

  const plansSubscriber: ModelSubscriber<Plan> = new ModelSubscriber();
  
  const isFocused = useIsFocused();

  const getPlans = async () => {
    if (currentStudent) {
      const plans = await Plan.getPlans(currentStudent.id);
      setPlans(plans)
      setLoading(false);
    }
  }
  
  const subscribeToPlans = async () => {
    getPlans()
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

  useEffect(() => {
    subscribeToPlans();
  }, [isFocused]);

  const extractKey = (plan: Plan) => plan.id;

  const renderItem = ({ item }: { item: Plan }) => (
    <StudentPlanListItem plan={item} navigation={navigation} updatePlans={subscribeToPlans}/>
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

  if (!loading && !plans.length) {
    return <EmptyStudentPlans navigation={navigation}/>;
  }

  return (
    <>
    {!loading &&
      <FullScreenTemplate padded darkBackground>
        <FlatList
          data={plans}
          renderItem={renderItem}
          keyExtractor={extractKey}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          style={styles.contentContainer}
        />
      </FullScreenTemplate>}
      {!loading && editionMode && <FixedCreatePlanButton onPress={navigateTo} />}
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
