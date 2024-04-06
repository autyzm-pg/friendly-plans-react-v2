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
    const { order } = planItemList[planItemList.length - 1];
    return order;
  };

  const createPlanItem = async (data: PlanItemFormData) => {
    const plan = route.params?.plan;

    //@ts-ignore
    const planItem: PlanItem = {
      id: "33",
      name: "LetterB",
      studentId: "1",
      planId: plan.id,
      type: data.type,
      completed: false,
      lector: false,
      nameForChild: i18n.t('planItemActivity:taskNameForChild'),
      order: getLastItemOrder(),
      time: data.time,
      image: "",
      voicePath: "",
    }
    
    PlanItem.createPlanItem(plan, data.type, data, getLastItemOrder())
    // const planItem = await PlanItem.createPlanItem(plan, data.type, data, getLastItemOrder());

    // if (data.type === PlanItemType.ComplexTask){
    //   if(data.subItems.length > 0) {
    //     await planItem.getRef().update({nameForChild: data.nameForChild});
    //     for (const subItem of data.subItems) {
    //       const planSubItemRef = await PlanSubItem.create(planItem);
    //       await planSubItemRef.update({'name': subItem.name, 'order': subItem.order, 'time': subItem.time,
    //         'image': subItem.image, 'lector': subItem.lector, 'voicePath': subItem.voicePath });
    //     }
    //   }
    // }

    setState({planItem: planItem});
  };

  const updatePlanItem = async (data: PlanItemFormData) => {
    
    const plan = route.params?.plan;

    //@ts-ignore
    const planItem: PlanItem = {
      id: "33",
      name: "LetterB",
      studentId: "1",
      planId: plan.id,
      type: data.type,
      completed: false,
      lector: false,
      nameForChild: i18n.t('planItemActivity:taskNameForChild'),
      order: getLastItemOrder(),
      time: data.time,
      image: "",
      voicePath: "",
    }
    
    PlanItem.updatePlanItem(planItem)
    // await state.planItem.update({
    //   name,
    //   nameForChild,
    //   time,
    //   image: imageUri,
    //   lector,
    //   voicePath,
    // });

    // if(formData.type === PlanItemType.ComplexTask) {

    //   for (let i = 0; i < formData.subItems.length; i++) {
    //     formData.subItems[i].order = i;
    //   }

    //   for (const subItem of formData.subItems) {
    //     if (subItem.id) {
    //       const planSubItemRef = await subItem.getRef();
    //       await planSubItemRef.update({
    //         'name': subItem.name, 'order': subItem.order, 'time': subItem.time,
    //         'image': subItem.image, 'lector': subItem.lector, 'voicePath': subItem.voicePath
    //       });
    //     } else {
    //       const planSubItemRef = await PlanSubItem.create(this.state.planItem);
    //       await planSubItemRef.update({
    //         'name': subItem.name, 'order': subItem.order, 'time': subItem.time,
    //         'image': subItem.image, 'lector': subItem.lector, 'voicePath': subItem.voicePath
    //       });
    //     }
    //   }

    //   for (const subItem of formData.deleteSubItems) {
    //     subItem.delete();
    //   }

    // }

    // setState({ planItem: { ...state.planItem, name, nameForChild, time, image: imageUri, lector, voicePath } });
  };

  const onSubmit = (formData: PlanItemFormData) =>
    state.planItem ? updatePlanItem(formData) : createPlanItem(formData);

  return <PlanItemForm 
  itemType={route.params?.planItemType} 
  planItem={state.planItem} 
  onSubmit={onSubmit} 
  taskNumber={route.params?.planItemList ? route.params?.planItemList.length + 1 : 0}
  navigation={navigation} />;
}
