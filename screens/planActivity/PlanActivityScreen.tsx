import every from 'lodash.every';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { DragEndParams } from 'react-native-draggable-flatlist';
//import { NavigationInjectedProps } from '@react-navigation/native';

import { FullScreenTemplate } from '../../components';
import { i18n } from '../../locale';
import {ModelSubscriber, Plan, PlanItem, PlanItemType, Student} from '../../models';
import { Route } from '../../navigation';
import { getElevation, palette } from '../../styles';
import { FixedCreatePlanItemButton } from './FixedCreatePlanItemButton';
import { PlanForm, PlanFormData, PlanFormError } from './PlanForm';
import { TaskTable } from './TaskTable';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

type RouteParams = {
  params: {
    plan: Plan,
    student: Student
  },
  routes: {
    test: Route.PlanItemTask
  }
}

interface Props {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}


interface State {
  plan: Plan;
  planItemList: PlanItem[];
}


export const PlanActivityScreen: React.FC<Props> = ({navigation, route}) => {
  const navigationOptions = {
    title: i18n.t('planList:viewTitle'),
  };

  //const { navigation } = props
  const student = route.params?.student;

  const [plan, setPlan] = useState({...route.params?.plan});

  const [planItemList, setPlanItemList] = useState<PlanItem[]>([]);

  const planItemsSubscriber: ModelSubscriber<PlanItem> = new ModelSubscriber();

  const subscribeToPlanItems = async () => {
    // this.planItemsSubscriber.subscribeCollectionUpdates(this.state.plan, (planItemList: PlanItem[]) =>
    //   this.setState({ planItemList }),
    // );
    // TODO: SQLite: pobieranie itemów z bazy
    
    const planItems = await PlanItem.createPlanItem(
      plan, 
      PlanItemType.SimpleTask, {
        name: `${i18n.t('planItemActivity:newTask')}${1}`,
        nameForChild: '',
        time:  0,
        subItems: [],
        deleteSubItems: [],
        type: PlanItemType.SimpleTask,
        imageUri: '',
        lector: false,
        voicePath:  ''
      }, 
      1)
    setPlanItemList([planItems])
  }

  const unsubscribeToPlanItems = () => {
    setPlanItemList([])
  }

  useEffect(() => {
    if (plan) {
      subscribeToPlanItems();
    }
    return unsubscribeToPlanItems()
  }, [plan]);

  const validatePlan = async ({ planInput }: PlanFormData): Promise<void> => {
    const errors: PlanFormError = {};
    if (planInput === '') {
      errors.planInput = i18n.t('validation:planNameRequired');
      throw errors;
    }

    const { id } = student;

    const { id: planId } = plan;

    const planExists: boolean = await Plan.isPlanExist(id, planInput, planId);

    if (planExists) {
      errors.planInput = i18n.t('validation:duplicatedPlan');
      throw errors;
    }
  };

  const createPlan = async (name: string) => {
    const { id } = student;

    const newPlan = await Plan.createPlan(id, name);
    setPlan(newPlan)

    // (?) should be deleted?
    //subscribeToPlanItems();
  };

  const updatePlan = async (name: string, emoji: string) => {
    if (plan) {
      await plan.update({ name, emoji });
      setPlan({ ...plan, name });
    }
  };

  const onSubmit = ({ planInput, emoji }: PlanFormData) =>
    plan ? updatePlan(planInput, emoji) : createPlan(planInput);

  const navigateToCreatePlanItem = async (name: string) => {
    let planItemType = '';

    switch (name){
      case 'create-simple-task':
        planItemType = PlanItemType.SimpleTask;
        break;
      case 'create-complex-task':
        planItemType = PlanItemType.ComplexTask;
        break;
      case 'create-interaction':
        planItemType = PlanItemType.Interaction;
        break;
      case 'create-break':
        planItemType = PlanItemType.Break;
        break;
    }

    // navigation.navigate(Route.PlanItemTask, {
    //   plan,
    //   planItemList,
    //   planItemType,
    // });

  };

  const shuffleDisabled = () => {
    return !planItemList || planItemList.length < 2;
  };

  const playDisabled = () => {
    if (!planItemList) {
      return true;
    }
    return every(planItemList, 'completed');
  };

  const handlePlanListOrderChanged = ({ data }: DragEndParams<PlanItem>) => {
    const planItemListRightOrder = data.map((item, index) => ({ ...item, order: index + 1 }));
    planItemListRightOrder.forEach(item => item.setOrder(item.order));
    setPlanItemList(planItemListRightOrder);
  };

  const shuffleTasks = () => {
    let array = [...planItemList];
    array.sort(() => Math.random() - 0.5);
    array.forEach((item, index) => item.setOrder(index));
    setPlanItemList(array);
  };

    return (
      <>
        <FullScreenTemplate extraStyles={styles.fullScreen}>
          <View style={styles.headerContainer}>
            <PlanForm
              onSubmit={onSubmit}
              plan={plan}
              numberPlan={route.params?.numberPlan}
              onValidate={validatePlan}
              shuffleDisabled={shuffleDisabled()}
              playDisabled={playDisabled()}
              onShuffle={shuffleTasks}
              navigation={navigation}
            />
          </View>
          <TaskTable planItemList={planItemList} handlePlanListOrderChanged={handlePlanListOrderChanged} />
        </FullScreenTemplate>
        {plan && <FixedCreatePlanItemButton onPress={() => navigateToCreatePlanItem('')} />}
      </>
    );
}

const styles = StyleSheet.create({
  headerContainer: {
    ...getElevation(5),
    backgroundColor: palette.background,
  },
  fullScreen: {
    // paddingHorizontal: 24,
    backgroundColor: palette.backgroundSurface,
    width: '100%'
  },
});
