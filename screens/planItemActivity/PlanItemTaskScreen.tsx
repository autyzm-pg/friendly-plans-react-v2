import {i18n} from '../../locale';
import {PlanItem, PlanItemType, PlanSubItem} from '../../models';
import React, { FC, useEffect, useState } from 'react';
import {PlanItemForm, PlanItemFormData} from './PlanItemForm';
import { NavigationProp, RouteProp } from '@react-navigation/native';

interface State {
  planItem: PlanItem;
}

interface Props {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}

export const PlanItemTaskScreen: FC<Props> = ({navigation, route}) => {
  const [state, setState] = useState<State>({ planItem: route.params?.planItem ?? undefined });
  
  const setScreenTitle = (title: string) => {
    navigation.setOptions({
      title: title,
    });
  };

  React.useEffect(() => {
    setScreenTitle(i18n.t('planItemActivity:viewTitleTask'));
  }, []);

  const getLastItemOrder = (): number => {
    const planItemList = route.params?.planItemList;
    if (!planItemList.length) {
      return 0;
    }
    const { itemOrder } = planItemList[planItemList.length - 1];
    return itemOrder;
  };

  const createPlanItem = async (data: PlanItemFormData) => {
    const plan = route.params?.plan;

    //@ts-ignore
    // const planItem: PlanItem = {
    //   name: data.name,
    //   studentId: state.planItem.studentId,
    //   planId: plan.id,
    //   type: data.type,
    //   completed: state.planItem.completed,
    //   lector: data.lector,
    //   nameForChild: i18n.t('planItemActivity:taskNameForChild'),
    //   itemOrder: state.planItem.itemOrder,
    //   time: data.time,
    //   image: data.imageUri,
    //   voicePath: data.voicePath,
    // }
    
    PlanItem.createPlanItem(plan, data.type, data, getLastItemOrder()).then(() => {
        navigation.goBack();
    });

    //setState({planItem: item});
  };

  const updatePlanItem = async (data: PlanItemFormData) => {
    const plan = route.params?.plan;

    //@ts-ignore
    const planItem: PlanItem = {
      id: state.planItem.id,
      planElementId: state.planItem.planElementId,
      name: data.name,
      studentId: state.planItem.studentId,
      planId: plan.id,
      type: data.type,
      completed: state.planItem.completed,
      lector: data.lector,
      nameForChild: data.nameForChild,
      itemOrder: state.planItem.itemOrder,
      time: data.time,
      image: data.imageUri,
      voicePath: data.voicePath,
    }
    
    PlanItem.updatePlanItem(planItem, data.subItems).then(() => {
      navigation.goBack();
    });
  };

  const onSubmit = (formData: PlanItemFormData) =>
    state.planItem ? updatePlanItem(formData) : createPlanItem(formData);

  return <PlanItemForm 
    itemType={route.params?.planItemType} 
    planItem={state.planItem} 
    onSubmit={onSubmit} 
    taskNumber={route.params?.planItemList ? route.params?.planItemList.length + 1 : 0}
    navigation={navigation}
    route={route}
  />;
}
