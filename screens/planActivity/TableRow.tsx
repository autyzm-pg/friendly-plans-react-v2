import { CheckboxInput, Icon, IconButton, IconButtonSwitch } from '../../components';
import { PlanItem, PlanItemType, PlanSubItem } from '../../models';
import React, {useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View, Platform, Button } from 'react-native';
import { dimensions, palette, typography } from '../../styles';
import { i18n } from '../../locale';

import { getIconName } from '../../mocks/defaults';
import { NavigationProp } from '@react-navigation/native';
import { Route } from '../../navigation';
import { PlanItemState, usePlanActivityContext } from '../../contexts/PlanActivityContext';

interface Props {
  border?: boolean;
  navigation: NavigationProp<any>;
  drag: () => void;
  item: PlanItemState;
};

export const TableRow: React.FC<Props> = ({ navigation, border, drag, item }) => {
  const { plan, planItems, setPlanItems, setRefreshFlag } = usePlanActivityContext();
  const [subtaskCount, setSubtaskCount] = useState(0);

  useEffect(() => {
    if (item.planItem.type !== PlanItemType.ComplexTask) { return; }
    PlanSubItem.getPlanSubItems(item.planItem).then(subItems => {
      setSubtaskCount(subItems.length);
    });
  }, [subtaskCount]);

  const navigateToPlanItemUpdate = () => {
    const planItem = item.planItem;
    navigation.navigate(Route.PlanItemTask, {
      plan,
      planItem,
      planItems,
      setSubtaskCount,
      setRefreshFlag
    });
  };

  const onDelete = async() => {
    Alert.alert(i18n.t('planActivity:deleteTaskHeader'), i18n.t('planActivity:deleteTaskInfo'), [
      { text: i18n.t('common:cancel') },
      {
        text: i18n.t('common:confirm'),
        onPress: async() => {
          await PlanItem.deletePlanItem(item.planItem);
          const updatedItems = planItems.filter(state => state.planItem.id !== item.planItem.id);
          setPlanItems(updatedItems);
        },
      },
    ]);
  };

  const handlePlanStateChange = async(completed: boolean) => {
    item.planItem.completed = completed;
    await PlanItem.updatePlanItem(item.planItem);
    if (item.planItem.type === PlanItemType.ComplexTask) {
      await PlanSubItem.getPlanSubItems(item.planItem).then(subItems => {
        subItems.forEach(async(subItem) => {
          subItem.completed = completed;
          await PlanSubItem.updatePlanSubItem(subItem);
        });
      });
    };
    const updatedItems = planItems.map(state => 
      state.planItem.id === item.planItem.id 
      ? { ...state, planItem: { ...state.planItem, completed } } 
      : state
    );
    setPlanItems(updatedItems);
  };

  const handleCheckBox = async() => {
    const updatedItems = planItems.map(state => 
      state.planItem.id === item.planItem.id 
      ? { ...state, checked: !state.checked } 
      : state
    );
    setPlanItems(updatedItems);
  };

  const hours = Math.floor(item.planItem.time / 3600);
  const minutes = Math.floor((item.planItem.time - hours*3600) / 60);
  const seconds = item.planItem.time - minutes*60 - hours*3600;

  const itemTimeText = hours + ':' + minutes + ':' + seconds;

  return (
    <TouchableOpacity style={[styles.row, border && styles.rowBorder]} onLongPress={drag} onPress={navigateToPlanItemUpdate}>
      <View style={styles.checkbox}>
        <CheckboxInput checked={item.checked} onPress={handleCheckBox}/>
      </View>
      <View style={styles.planIcon}>
        <Icon name={getIconName(item.planItem.type)} type="material" />
      </View>
      <Text style={styles.textName}>{item.planItem.name}{' '}</Text>
      {(item.planItem.type === PlanItemType.ComplexTask)&&<Text style={styles.text}>{`(${subtaskCount})`}{' '}</Text>}
      <View style={{flex: 1, flexDirection: 'row-reverse', alignItems: 'center'}}>
        <View style={styles.deleteIcon}>
          <IconButton name='delete' size={24} color={palette.primary} onPress={onDelete} />
        </View>
        <IconButtonSwitch 
          iconNames={['check', 'close']} 
          titles={[i18n.t('common:yes'), i18n.t('common:no')]} 
          title={i18n.t('planActivity:completed')} 
          secondButtonOn={!item.planItem.completed} 
          onPress={handlePlanStateChange}/>
        {!!item.planItem.time && (
          <View style={styles.timeContainer}>
            <Icon name='timer' size={24} />
            <View style={styles.timeLabelContainer}>
              <Text style={styles.textName}>{itemTimeText}</Text>
            </View>
          </View>
        )}
        </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    height: 64,
    alignSelf: 'stretch',
    flexDirection: 'row',
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  rowBorder: {
    borderBottomColor: palette.backgroundAdditional,
    borderBottomWidth: 1,
  },
  text: {
    ...typography.body,
    color: palette.textBody,
  },
  textName: {
    ...typography.body,
    color: palette.textBody,
  },
  cell: {
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  deleteIcon: {
    marginLeft: 10,
    marginRight: 10
  },
  pencilIcon: {
    marginLeft: 10,
    marginRight: 10
  },
  planIcon: {
    marginRight: 10,
  },
  checkbox: {
    marginRight: 15,
  },
  timeContainer: {
    marginLeft: 10,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeLabelContainer: {
    marginLeft: 10,
  },
});
