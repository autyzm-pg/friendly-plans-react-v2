import {CheckboxInput, Icon, IconButton} from '../../components';
import {Plan, PlanItem, PlanItemType, PlanSubItem} from '../../models';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {palette, typography, dimensions} from '../../styles';
import { i18n } from '../../locale';

import { getIconName } from '../../mocks/defaults';
import { NavigationProp } from '@react-navigation/native';
import { Route } from '../../navigation';

interface Props {
  rowNumber: number;
  border?: boolean;
  planItem: PlanItem;
  navigation: NavigationProp<any>;
  plan: Plan;
  planItemList: PlanItem[];
  drag: () => void;
  setRefreshFlag: any;
}

export const TableRow: React.FC<Props> = ({ navigation, planItem, border, plan, planItemList, drag, setRefreshFlag}) => {
  const [subtaskCount, setSubtaskCount] = useState(0);
  const [planState, setPlanState] = useState(planItem.completed);

  useEffect(() => {
    if (planItem.type === PlanItemType.ComplexTask) {
        PlanSubItem.getPlanSubItems(planItem).then(subItems => {
          setSubtaskCount(subItems.length);
        })
    }
  }, [subtaskCount]);

  // const refresh = () => {
    // planItem
    //     .getChildCollectionRef()
    //     .get()
    //     .then(snap => setSubtaskCount(snap.size));
  // };

  const navigateToPlanItemUpdate = () => {
    navigation.navigate(Route.PlanItemTask, {
      plan,
      planItem,
      planItemList,
      setSubtaskCount
    });
  };

  const onDelete = () => {
    PlanItem.deletePlanItem(planItem);
    setRefreshFlag();
  };

  const handlePlanStateChange = () => {
    // planItem.setComplete(!planItem.completed);
    planItem.completed = !planItem.completed;
    PlanItem.updatePlanItem(planItem)
    setPlanState(!planState);
  };

  const hours = Math.floor(planItem.time / 3600);
  const minutes = Math.floor((planItem.time - hours*3600) / 60);
  const seconds = planItem.time - minutes*60 - hours*3600;

  const itemTimeText = hours + ':' + minutes + ':' + seconds;

  return (
    <TouchableOpacity style={[styles.row, border && styles.rowBorder]} onLongPress={drag} onPress={navigateToPlanItemUpdate}>
      <View style={styles.checkbox}>
        <CheckboxInput checked={true} onPress={() => {}} />
      </View>
      <View style={styles.planIcon}>
        <Icon name={getIconName(planItem.type)} type="material" />
      </View>
      <Text style={styles.textName}>{planItem.name}{' '}</Text>
      {(planItem.type === PlanItemType.ComplexTask)&&<Text style={styles.text}>{`(${subtaskCount})`}{' '}</Text>}
      <Text onPress={handlePlanStateChange} style={[styles.text, {color: planItem.completed ? palette.playButton : palette.deleteStudentButton}]}>
        {planItem.completed ? i18n.t('planActivity:activeStatus') : i18n.t('planActivity:notActiveStatus')}
      </Text>
      <View style={{flex: 1, flexDirection: 'row-reverse'}}>
        {!!planItem.time && (
          <View style={styles.timeContainer}>
            <Icon name='timer' size={24} />
            <View style={styles.timeLabelContainer}>
              <Text style={styles.textName}>{itemTimeText}</Text>
            </View>
          </View>
        )}
        <View style={styles.deleteIcon}>
          <IconButton name='delete' size={24} color={palette.primary} onPress={onDelete} />
        </View>
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
