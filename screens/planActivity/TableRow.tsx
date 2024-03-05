import {CheckboxInput, Icon, IconButton} from '../../components';
import {PlanItem, PlanItemType} from '../../models';
import {Route} from '../../navigation';
import React, {useEffect, useRef, useState} from 'react';

import {AppState, AppStateStatus, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
//import {NavigationService} from 'services';
import {palette, typography} from '../../styles';

interface Props {
  rowNumber: number;
  border?: boolean;
  planItem: PlanItem;
  drag: () => void;
}

export const TableRow: React.FunctionComponent<Props> = ({ planItem, border, drag }) => {
  const [subtaskCount, setSubtaskCount] = useState(0);


  useEffect(() => {
    if (planItem.type === PlanItemType.ComplexTask) {
      // planItem
      //   .getChildCollectionRef()
      //   .get()
      //   .then(snap => setSubtaskCount(snap.size));
    }

  });

  const refresh = () => {
    // planItem
    //     .getChildCollectionRef()
    //     .get()
    //     .then(snap => setSubtaskCount(snap.size));
  };

  const navigateToPlanItemUpdate = () => {
    // NavigationService.navigate(Route.PlanItemTask, {
    //   planItem,
    // });
  };

  const onDelete = () => {
    planItem.delete();
  };

  const handleCheckboxChange = () => {
    planItem.setComplete(!planItem.completed);
  };

  const hours = Math.floor(planItem.time / 3600);
  const minutes = Math.floor((planItem.time - hours*3600) / 60);
  const seconds = planItem.time - minutes*60 - hours*3600;

  const itemTimeText = hours + ':' + minutes + ':' + seconds;

  return (
    <TouchableOpacity style={[styles.row, border && styles.rowBorder]} onLongPress={drag}>
      <View style={styles.checkbox}>
        <CheckboxInput checked={planItem.completed} onPress={handleCheckboxChange} />
      </View>
      <View style={styles.planIcon}>
        <Icon name={planItem.getIconName()} type="material" />
      </View>
      <Text style={styles.textName}>{planItem.name}</Text>
      {(planItem.type === PlanItemType.ComplexTask)&&<Text onPress={refresh} style={styles.text}>{` (${subtaskCount})`}</Text>}
      {!!planItem.time && (
        <View style={styles.timeContainer}>
          <Icon name="timer" size={24} />
          <View style={styles.timeLabelContainer}>
            <Text style={styles.textName}>{itemTimeText}</Text>
          </View>
        </View>
      )}
      <View style={styles.deleteIcon}>
        <IconButton name="delete" size={24} color={palette.primary} onPress={onDelete} />
      </View>
      <View style={styles.pencilIcon}>
        <IconButton name="pencil" size={24} onPress={navigateToPlanItemUpdate} />
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
    position: 'absolute',
    right: 38,
  },
  pencilIcon: {
    position: 'absolute',
    right: 80,
  },
  planIcon: {
    marginRight: 10,
  },
  checkbox: {
    marginRight: 15,
  },
  timeContainer: {
    position: 'absolute',
    right: 138,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeLabelContainer: {
    marginLeft: 10,
  },
});
