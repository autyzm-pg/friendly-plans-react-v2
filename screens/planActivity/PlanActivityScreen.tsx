import React, { FC, useState, useEffect, useRef } from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';

import { DEFAULT_EMOJI } from '../../assets/emojis';
import { Button, FullScreenTemplate } from '../../components';
import { i18n } from '../../locale';
import { Plan, PlanItem, PlanItemType } from '../../models';
import { Route } from '../../navigation';
import { dimensions, getElevation, palette } from '../../styles';
import { FixedCreatePlanItemButton } from './FixedCreatePlanItemButton';
import { PlanForm, PlanFormData, PlanFormError } from './PlanForm';
import { TaskTable } from './TaskTable';
import { NavigationProp, RouteProp, useIsFocused } from '@react-navigation/native';
import { useCurrentStudentContext } from '../../contexts/CurrentStudentContext';
import { PlanActivityContext, PlanItemState } from '../../contexts/PlanActivityContext';
import { MultiButton } from '../../components/MultiButton';

interface Props {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
};

export const PlanActivityScreen: FC<Props> = ({navigation, route}) => {
  const {currentStudent} = useCurrentStudentContext();
  const isFocused = useIsFocused();

  const [planItems, setPlanItems] = useState<PlanItemState[]>([]);
  const [refreshFlag, setRefreshFlag] = useState<boolean>(false);
  const [plan, setPlan] = useState<Plan>(route.params?.plan ?? undefined);

  const planRunning = useRef(false);
  const planRef = useRef<Plan | undefined>(route.params?.plan ?? undefined);
  const pendingNameRef = useRef('');
  const createPlanPromiseRef = useRef<Promise<Plan | undefined> | null>(null);

  const getPlanItems = async () => {
    if (!plan) { return; }
    const planItems = await PlanItem.getPlanItems(plan);
    if (!planItems.length) {
      setPlanItems([]);
      return;
    }
    const min = planItems.reduce((min, item) => item.itemOrder < min ? item.itemOrder : min, planItems[0].itemOrder);
    const max = planItems.reduce((max, item) => item.itemOrder > max ? item.itemOrder : max, planItems[0].itemOrder);
    const planItemsState: PlanItemState[] = planItems.map((item) => { 
      const isLocked: boolean = (item.type == PlanItemType.Break || item.itemOrder == min || item.itemOrder == max);
      return { planItem: item, checked: false, locked: isLocked }; 
    });
    setPlanItems(planItemsState);
  };
  
  useEffect(() => {
    if (!isFocused) { return; }
    getPlanItems();
  }, [isFocused, refreshFlag]);

  useEffect(() => {
    return () => {
      if (!planRunning.current)
        ToastAndroid.show(i18n.t('planActivity:savedMessage'), 2.5);
    }
  }, [])

  const validatePlan = async ({ planInput }: PlanFormData): Promise<void> => {
    const errors: PlanFormError = {};
    if (planInput === '' && planRef.current) {
      errors.planInput = i18n.t('validation:planNameRequired');
      throw errors;
    }
    const planExists: boolean = false;
    if (planExists) {
      errors.planInput = i18n.t('validation:duplicatedPlan');
      throw errors;
    }
  };

  const createPlan = async (name: string): Promise<Plan | undefined> => {
    if (name === '') {
      name = `${i18n.t('planActivity:newPlan')}${route.params?.numberPlan}`;
    }
    if (!currentStudent) {
      return undefined;
    }
    const createdPlan = await Plan.createPlan(currentStudent?.id, name, DEFAULT_EMOJI);
    planRef.current = createdPlan;
    setPlan(createdPlan);
    return createdPlan;
  };

  const ensurePlan = async (): Promise<Plan | undefined> => {
    if (planRef.current) {
      return planRef.current;
    }
    if (createPlanPromiseRef.current) {
      return createPlanPromiseRef.current;
    }
    createPlanPromiseRef.current = createPlan(pendingNameRef.current).finally(() => {
      createPlanPromiseRef.current = null;
    });
    return createPlanPromiseRef.current;
  };

  const updatePlan = async (name: string, emoji: string) => {
    const currentPlan = planRef.current;
    if (!(currentPlan && currentStudent?.id)) { return; }
    const updatedPlan: Plan = {
      ...currentPlan,
      name: name,
      emoji: emoji
    };
    await Plan.updatePlan(updatedPlan, currentStudent?.id);
    planRef.current = updatedPlan;
    setPlan(updatedPlan);
  };

  const onSubmit = ({ planInput, emoji }: PlanFormData) => {
    pendingNameRef.current = planInput;
    if (planRef.current) {
      updatePlan(planInput, emoji);
    } else {
      ensurePlan();
    }
  };

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
    const currentPlan = await ensurePlan();
    if (!currentPlan) {
      return;
    }
    navigation.navigate(Route.PlanItemTask, {
      plan: currentPlan,
      planItems,
      planItemType,
      setRefreshFlag,
    });
  };

  const updatePlanItemsOrder = async(items: PlanItemState[]) => {
    const planItemsRightOrder = items.map((item, index) => ({
      ...item.planItem,
      itemOrder: index + 1
    }));
    for (const planItem of planItemsRightOrder) {
      await PlanItem.updatePlanItem(planItem);
    }
  };

  const unSelectAll = () => {
    const checked = planItems.filter((state) => state.checked).length;
    if (checked == planItems.length) {
      const updated = planItems.map((state) => { return {...state, checked: false}; });
      setPlanItems(updated);
    } else {
      const updated = planItems.map((state) => { return {...state, checked: true}; });
      setPlanItems(updated);
    }
  };

  const savePlan = async () => {
    await ensurePlan();
    navigation.goBack();
  }

  const onPlanRun = () => {
    planRunning.current = true;
  }

  const renderSelectMultiple = () => {
    const checked = planItems.filter((state) => state.checked).length;
    if (!checked) { return <></>; }
    const selectAll = checked !== planItems.length;
    return (
      <View style={{ alignItems: 'flex-start', 
                     marginLeft: dimensions.spacingBig, 
                     marginTop: dimensions.spacingSmall }}>
        <MultiButton onPress={unSelectAll} 
                     title={selectAll ? i18n.t('planActivity:selectTasks') : i18n.t('planActivity:unSelectTasks')}
                     buttonName={selectAll ? 'check-square' : 'square'} 
                     buttonType='feather' 
                     disabled={false}/>
      </View>
    );
  };

  return (
    <PlanActivityContext.Provider value={{ 
      planItems: planItems, 
      setPlanItems: setPlanItems,
      refreshFlag: refreshFlag,
      setRefreshFlag: setRefreshFlag,
      plan: plan,
      setPlan: setPlan
      }}>
      <FullScreenTemplate extraStyles={styles.fullScreen}>
        <View style={styles.headerContainer}>
          <PlanForm
            onSubmit={onSubmit}
            onValidate={validatePlan}
            navigation={navigation}
            updatePlanItemsOrder={updatePlanItemsOrder}
            onPlanRun={onPlanRun}
            onPlanNameChange={(name) => { pendingNameRef.current = name; }}
          />
        </View>
        {renderSelectMultiple()}
        <TaskTable 
          navigation={navigation}
          updatePlanItemsOrder={updatePlanItemsOrder}
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
          onPress={savePlan}
        />
      </View>
      <FixedCreatePlanItemButton onPress={navigateToCreatePlanItem} />
    </PlanActivityContext.Provider>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    ...getElevation(5),
    backgroundColor: palette.background,
  },
  fullScreen: {
    backgroundColor: palette.backgroundSurface,
    width: '100%',
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
