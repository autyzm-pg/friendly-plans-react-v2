import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';

import { ModelSubscriber, Plan, PlanElement, PlanItem, PlanSubItem, Student } from '../../../models';
import { PlanElementListItem } from './PlanElementListItem';
import { NavigationProp } from '@react-navigation/native';
import { useCurrentStudentContext } from '../../../contexts/CurrentStudentContext';

interface Props {
  itemParent: Plan | PlanItem;
  onGoBack: any;
  navigation: NavigationProp<any>;
  isSubItemsList?: boolean;
}

interface State {
  items: PlanElement[];
  student: Student;
}

export const PlanElementList: React.FC<Props> = ({itemParent, navigation, onGoBack, isSubItemsList}) => {
  const {currentStudent, setCurrentStudent} = useCurrentStudentContext();
  const [items, setItems] = useState<PlanItem[] | PlanSubItem[]>([]);

  useEffect(() => {
    if (isSubItemsList) {
      PlanSubItem.getPlanSubItems(itemParent as PlanItem).then(planItems => {
        setItems(planItems);
      })
    } else {
      PlanItem.getPlanItems(itemParent as Plan).then(planItems => {
        setItems(planItems);
      })
    }
  }, [])

  useEffect(() => {
    if (isEveryPlanItemCompleted()) {
      onGoBack();
      updateAllItemsAsUncompleted();
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
    return items.length && completedPlanItemCounter() >= items.length;
  }

  const completedPlanItemCounter = () => {
    const index = items.reduce(
      (planItemsCompleted, planItem) => (planItem.completed ? ++planItemsCompleted : planItemsCompleted),
      0,
    );
    console.log(index)
    return index;
  }

  const onItemCompleted = (completedItem: PlanItem | PlanSubItem) => {
    const itemToComplete = items.find(item => item.id === completedItem.id)!;
    itemToComplete.completed = true;
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
        isSubItem={isSubItemsList}
      />
    );
  };

  const extractKey = (planElement: PlanElement) => planElement.id;

  return <FlatList data={items} renderItem={renderItem} keyExtractor={extractKey} />;
}
