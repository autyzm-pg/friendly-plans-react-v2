import {i18n} from '../../locale';
import {PlanItem } from '../../models';
import React, { FC, useState } from 'react';
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
    PlanItem.createPlanItem(plan, data.type, data, getLastItemOrder()).then(() => {
        navigation.goBack();
    });
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
    
    PlanItem.updatePlanItem(planItem, data.subItems, data.deleteSubItems).then(() => {
      navigation.goBack();
    });
  };

  const onSubmit = (formData: PlanItemFormData) => {
    if (state.planItem) {
      updatePlanItem(formData);
    } else {
      createPlanItem(formData);
    }
    route.params?.setRefreshFlag();
  }

  return <PlanItemForm 
    itemType={route.params?.planItemType} 
    planItem={state.planItem} 
    onSubmit={onSubmit} 
    taskNumber={route.params?.planItemList ? route.params?.planItemList.length + 1 : 0}
    navigation={navigation}
    route={route}
  />;
}
