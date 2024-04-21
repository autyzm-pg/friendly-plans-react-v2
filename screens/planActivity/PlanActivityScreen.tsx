import every from 'lodash.every';
import React, { FC, useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { DragEndParams } from 'react-native-draggable-flatlist';

import { Button, FullScreenTemplate } from '../../components';
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
  const [plan, setPlan] = useState<Plan>(
    route.params?.plan ?? undefined,
  );

  const [planItemList, setPlanItemList] = useState<PlanItem[]>([]);

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
    if (planInput === '' && plan) {
      errors.planInput = i18n.t('validation:planNameRequired');

      throw errors;
    }

    const planExists: boolean = false;

    if (planExists) {
      errors.planInput = i18n.t('validation:duplicatedPlan');
      throw errors;
    }
  };

  const createPlan = async (name: string) => {
    if (name === '') {
      name = `${i18n.t('planActivity:newPlan')}${route.params?.numberPlan}`
    }
    if (currentStudent) {
      const plan = await Plan.createPlan(currentStudent?.id, name);
      setPlan(plan);
    }
  };

  const updatePlan = async (name: string, emoji: string) => {
    if (plan && currentStudent?.id) {
      const updatedPlan: Plan = {
        ...plan,
        name: name,
        emoji: emoji
      };
      await Plan.updatePlan(updatedPlan, currentStudent?.id);
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

    return !planItemList || planItemList.length < 2;
  };

  const playDisabled = () => {
    if (!planItemList) {
      return true;
    }
    return every(planItemList, 'completed');
  };

  const updatePlanItemsOrder = async (items: PlanItem[]) => {
    const planItemListRightOrder = items.map((item, index) => ({ ...item, itemOrder: index + 1 }));
    setPlanItemList(planItemListRightOrder as PlanItem[]);
    for (const planItem of planItemListRightOrder) {
      await PlanItem.updatePlanItem(planItem)
    }

    setPlanItemList(planItemListRightOrder);
  }

  const handlePlanListOrderChanged = ({ data }: DragEndParams<PlanItem>) => {
    updatePlanItemsOrder(data)
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
    updatePlanItemsOrder(array)
  };

  const saveAndClose = () => {
    navigation.goBack()
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
        <TaskTable 
          plan={plan!}
          planItemList={planItemList} 
          handlePlanListOrderChanged={handlePlanListOrderChanged} 
          navigation={navigation}
        />
      </FullScreenTemplate>
      <View style={styles.saveButtonContainer}>
        <Button
          buttonStyle={styles.saveButton}
          title={i18n.t('updatePlan:saveSchedule')}
          icon={{
            name: 'check',
            type: 'material',
            color: palette.textWhite,
            size: 22,
          }}
          isUppercase
          onPress={saveAndClose}
        />
      </View>
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
  saveButtonContainer: {
    width: '100%',
    padding: 12,
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    paddingVertical: 16,
    paddingRight: 36,
    paddingLeft: 32
  },
});
