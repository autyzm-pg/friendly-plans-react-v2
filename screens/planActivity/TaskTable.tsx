import React, { FC } from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import DraggableFlatList, { DragEndParams, RenderItemParams } from 'react-native-draggable-flatlist';

import { FullScreenTemplate } from '../../components';
import { PlanItem } from '../../models';
import { dimensions, getElevation, palette } from '../../styles';
import { TableRow } from './TableRow';

interface Props {
  planItemList: PlanItem[];
  handlePlanListOrderChanged: (planItemList: DragEndParams<PlanItem>) => void;
}

export const TaskTable: FC<Props> = ({ planItemList, handlePlanListOrderChanged }) => {
  const data = planItemList.map(item => ({ ...item, key: item.id, label: item.name }));

  const keyExtractor = (item: PlanItem) => `draggable-item-${item.id}`;

  return (
    <FullScreenTemplate darkBackground extraStyles={styles.fullScreen}>
      <DraggableFlatList
        data={data}
        renderItem={({ item, index, drag }: RenderItemParams<PlanItem>) => (
          <View style={styles.tableContainer}>
            <TableRow
              planItem={item}
              border={index !== planItemList.length - 1}
              key={index}
              rowNumber={index ? index + 1 : 0}
              drag={drag}
            />
          </View>
        )}
        keyExtractor={keyExtractor}
        onDragEnd={handlePlanListOrderChanged}
        activationDistance={10}
      />
    </FullScreenTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    ...getElevation(1),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.background,
    marginHorizontal: '6%',
    borderBottomLeftRadius: dimensions.spacingMedium,
    borderBottomRightRadius: dimensions.spacingMedium,
  },
  fullScreen: {
    marginLeft: '2%',
    marginTop: 16,
  },
  tableContainer: {
    backgroundColor: palette.background,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: palette.shadowPurple,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 5,
    width: '98%',
  },
});
