import every from 'lodash.every';
import React, { FC, useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { DragEndParams } from 'react-native-draggable-flatlist';

import { FullScreenTemplate } from '../../components';
import { i18n } from '../../locale';
import { Plan, PlanItem, PlanItemType, Student } from '../../models';
import { Route } from '../../navigation';
import { getElevation, palette } from '../../styles';
import { FixedCreatePlanItemButton } from './FixedCreatePlanItemButton';
import { PlanForm, PlanFormData, PlanFormError } from './PlanForm';
import { TaskTable } from './TaskTable';
import { NavigationProp } from '@react-navigation/native';
import { defaults } from "../../mocks/defaults"

interface Props {
  navigation: NavigationProp<any>;
  student?: Student;
  plan?: Plan;
  numberPlan?: number;
}

export const PlanActivityScreen: FC<Props> = ({navigation, student, plan, numberPlan}) => {
  const [state, setState] = useState<{ plan: Plan | undefined; planItemList: PlanItem[] }>({
    plan: plan,
    planItemList: []
  });

  // const navigationOptions = {
  //   title: i18n.t('planList:viewTitle'),
  // };

  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      planItemList: defaults.planItemsList
    }));
  }, []);

  const validatePlan = async ({ planInput }: PlanFormData): Promise<void> => {
    const errors: PlanFormError = {};
    if (planInput === '') {
      errors.planInput = i18n.t('validation:planNameRequired');
      throw errors;
    }

    // const { id } = student;

    // const { id: planId } = state.plan;

    const isPlanExist: boolean = true; // await Plan.isPlanExist(id, planInput, planId);

    if (isPlanExist) {
      errors.planInput = i18n.t('validation:duplicatedPlan');
      throw errors;
    }
  };

  const createPlan = async (name: string) => {
    // const { id } = student;

    // const plan = await Plan.createPlan(id, name);

    // this.setState({ plan }, () => {
    //   this.subscribeToPlanItems();
    // });
  };

  const updatePlan = async (name: string, emoji: string) => {
    // await this.state.plan.update({
    //   name,
    //   emoji,
    // });

    if (state.plan) {
      const updatedPlan: Plan = {
        ...state.plan,
        name: name,
        emoji: emoji
      };
  
      setState(prevState => ({
        ...prevState,
        plan: updatedPlan
      }));
    }
  };

  const onSubmit = ({ planInput, emoji }: PlanFormData) =>
    state.plan ? updatePlan(planInput, emoji) : createPlan(planInput);

  const navigateToCreatePlanItem = async (name: string) => {

    const {plan, planItemList} = state;
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

    navigation.navigate(Route.PlanItemTask, {
      plan,
      planItemList,
      planItemType,
    });

  };

  const shuffleDisabled = (): boolean => {
    const { planItemList } = state;

    return !planItemList || planItemList.length < 2;
  }

  const playDisabled = (): boolean => {
    const { planItemList } = state;
    if (!planItemList) {
      return true;
    }

    return every(planItemList, 'completed');
  }

  const handlePlanListOrderChanged = ({ data }: DragEndParams<PlanItem>) => {
    const planItemListRightOrder = data.map((item, index) => ({ ...item, order: index + 1 }));
    planItemListRightOrder.forEach(item => item.setOrder(item.order));
    setState(prevState => ({
      ...prevState,
      planItemList: planItemListRightOrder as []
    }));
  };

  const shuffle = (array: PlanItem[]) => {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  const shuffleTasks = () => {
    const { planItemList } = state;
    let array = planItemList;
    array = shuffle(array);
    array.forEach((item, index) => item.setOrder(index));
    setState(prevState => ({
      ...prevState,
      planItemList: array
    }));
  };

  return (
    <>
      <FullScreenTemplate extraStyles={styles.fullScreen}>
        <View style={styles.headerContainer}>
          <PlanForm
            onSubmit={onSubmit}
            plan={plan}
            numberPlan={numberPlan}
            onValidate={validatePlan}
            shuffleDisabled={shuffleDisabled()}
            playDisabled={playDisabled()}
            onShuffle={shuffleTasks}
            student={student}
            navigation={navigation}
          />
        </View>
        {/* <TaskTable planItemList={state.planItemList} handlePlanListOrderChanged={handlePlanListOrderChanged} /> */}
      </FullScreenTemplate>
      {plan && <FixedCreatePlanItemButton onPress={navigateToCreatePlanItem} />}
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    ...getElevation(5),
    backgroundColor: palette.background,
  },
  fullScreen: {
    backgroundColor: palette.backgroundSurface,
    width: '100%'
  },
});
