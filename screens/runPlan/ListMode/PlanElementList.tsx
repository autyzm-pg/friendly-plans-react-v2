import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';

import { Plan, PlanElement, PlanItem, PlanSubItem, Student } from '../../../models';
import { PlanElementListItem } from './PlanElementListItem';
import { NavigationProp } from '@react-navigation/native';
import { useCurrentStudentContext } from '../../../contexts/CurrentStudentContext';

interface Props {
  itemParent: Plan | PlanItem;
  onGoBack: any;
  navigation: NavigationProp<any>;
  isSubItemsList?: boolean;
}

export const PlanElementList: React.FC<Props> = ({itemParent, navigation, onGoBack, isSubItemsList}) => {
  const {currentStudent, setCurrentStudent} = useCurrentStudentContext();
  const [items, setItems] = useState<PlanItem[] | PlanSubItem[]>([]);

  useEffect(() => {
    if (isSubItemsList) {
      PlanSubItem.getPlanSubItems(itemParent as PlanItem).then(planItems => {
        setItems(planItems);
      });
    } else {
      PlanItem.getPlanItems(itemParent as Plan).then(planItems => {
        setItems(planItems);
      });
    }
  }, [])

  useEffect(() => {
    if (isEveryPlanItemCompleted()) {
      onGoBack();
      // TODO: do we want to mark tasks as not completed automatically after finishing?
      //updateAllItemsAsUncompleted();
    }
  }, [items])

  const updateAllItemsAsUncompleted = () => {
    items.map((item: PlanItem | PlanSubItem) => {
      item.completed = false
      isSubItemsList 
        ? PlanSubItem.updatePlanSubItem(item as PlanSubItem)
        : PlanItem.updatePlanItem(item as PlanItem);
    });
  };

  const isEveryPlanItemCompleted = () => {
    return items.length && completedPlanItemCounter() == -1;
  }

  const completedPlanItemCounter = () => {
    const index = items.findIndex(planItem => !planItem.completed);
    return index;
  }

  const onItemCompleted = (completedItem: PlanItem | PlanSubItem) => {
    const itemToComplete = items.find(item => item.id === completedItem.id)!;
    itemToComplete.completed = true;
    setItems([]);
    setItems(items);
  }

  const onItemUncompleted = (uncompletedItem: PlanItem | PlanSubItem, currentTaskId: number) => {
    const itemToUncomplete = items.find(item => item.id === uncompletedItem.id)!;
    itemToUncomplete.completed = false;
    for (const item of items) {
      if (isSubItemsList && item.id > itemToUncomplete.id) {
        (item as PlanSubItem).uncomplete();
        item.completed = false;
      }
      else if (currentTaskId + 1 > item.itemOrder && item.itemOrder > itemToUncomplete.itemOrder) {
        // console.log(item.itemOrder);
        item.uncomplete();
        item.completed = false;
      }
    }
    setItems([]);
    setItems(items);
  }

  const renderItem = ({ item, index }: { item: PlanElement; index: number }) => {
    // if (item.completed) {
    //   return null;
    // }

    return (
      <PlanElementListItem
        itemParent={itemParent}
        item={item}
        index={index}
        currentTaskIndex={completedPlanItemCounter()}
        student={currentStudent!}
        navigation={navigation}
        onItemCompleted={onItemCompleted}
        onItemUncompleted={onItemUncompleted}
        isSubItem={isSubItemsList}
      />
    );
  };

  const extractKey = (planElement: PlanElement) => planElement.id;

  return <FlatList data={items} renderItem={renderItem} keyExtractor={extractKey} />;
}
