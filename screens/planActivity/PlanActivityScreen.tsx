import every from 'lodash.every';
import React, { FC, useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { DragEndParams } from 'react-native-draggable-flatlist';

import { FullScreenTemplate } from '../../components';
import { i18n } from '../../locale';
import { Plan, PlanItem, PlanItemType } from '../../models';
import { Route } from '../../navigation';
import { getElevation, palette } from '../../styles';
import { FixedCreatePlanItemButton } from './FixedCreatePlanItemButton';
import { PlanForm, PlanFormData, PlanFormError } from './PlanForm';
import { TaskTable } from './TaskTable';
import { NavigationProp, RouteProp, useIsFocused } from '@react-navigation/native';
import { useCurrentStudentContext } from '../../contexts/CurrentStudentContext';

interface Props {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}

export const PlanActivityScreen: FC<Props> = ({navigation, route}) => {
  // const [state, setState] = useState<{ plan: Plan | undefined; planItemList: PlanItem[] }>({
  //   plan: route.params?.plan ?? undefined,
  //   planItemList: []
  // });

  const [plan, setPlan] = useState<Plan | undefined>(
    route.params?.plan ?? undefined,
  );

  const [planItemList, setPlanItemList] = useState<PlanItem[]>([]);
  
  // const {plan, planItemList} = state;

  const {currentStudent} = useCurrentStudentContext();

  const isFocused = useIsFocused();

  const setScreenTitle = (title: string) => {
    navigation.setOptions({
      title: title,
    });
  };

  const getPlanItems = async () => {
    if (plan) {
      const planItems = await PlanItem.getPlanItems(plan)
      setPlanItemList(planItems)
    }
  }

  useEffect(() => {
    setScreenTitle(i18n.t('planList:viewTitle'))
  }, []);

  
  useEffect(() => {
    if (isFocused)
      getPlanItems()
  }, [isFocused]);

  const validatePlan = async ({ planInput }: PlanFormData): Promise<void> => {
    const errors: PlanFormError = {};
    if (planInput === '') {
      errors.planInput = i18n.t('validation:planNameRequired');
      throw errors;
    }

    // const { id } = student;

    // const { id: planId } = state.plan;

    const planExists: boolean = false; // await Plan.isPlanExist(id, planInput, planId);

    if (planExists) {
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
    console.log('creating new plan')
    if (currentStudent) {
      const newPlan = await Plan.createPlan(currentStudent?.id, name)
      
    }
  };

  const updatePlan = async (name: string, emoji: string) => {
    // await this.state.plan.update({
    //   name,
    //   emoji,
    // });
    console.log('updating plan')

    if (plan) {
      const updatedPlan: Plan = {
        ...plan,
        name: name,
        emoji: emoji
      };
  
      setPlan(updatedPlan);
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

    navigation.navigate(Route.PlanItemTask, {
      plan,
      planItemList,
      planItemType,
    });

  };

  const shuffleDisabled = (): boolean => {
    // const { planItemList } = state;

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
    setPlanItemList(planItemListRightOrder as PlanItem[]);
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
    let array = planItemList;
    array = shuffle(array);

    setPlanItemList(array);
  };

  return (
    <>
      <FullScreenTemplate extraStyles={styles.fullScreen}>
        <View style={styles.headerContainer}>
          <PlanForm
            onSubmit={onSubmit}
            plan={plan}
            numberPlan={route.params?.numberPlan ?? {}}
            onValidate={validatePlan}
            shuffleDisabled={shuffleDisabled()}
            playDisabled={playDisabled()}
            onShuffle={shuffleTasks}
            student={route.params?.student ?? {}}
            navigation={navigation}
          />
        </View>
        <TaskTable planItemList={planItemList} handlePlanListOrderChanged={handlePlanListOrderChanged} navigation={navigation}/>
      </FullScreenTemplate>
      <FixedCreatePlanItemButton onPress={navigateToCreatePlanItem} />
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
