import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import DraggableFlatList, { DragEndParams, RenderItemParams } from 'react-native-draggable-flatlist';

import { FullScreenTemplate } from '../../components';
import { dimensions, getElevation, palette } from '../../styles';
import { TableRow } from './TableRow';
import { NavigationProp } from '@react-navigation/native';
import { PlanItemState, usePlanActivityContext } from '../../contexts/PlanActivityContext';

interface Props {
  navigation: NavigationProp<any>;
  updatePlanItemsOrder: (items: PlanItemState[]) => Promise<void>;
};

export const TaskTable: FC<Props> = ({ navigation, updatePlanItemsOrder }) => {
  const { planItems, setPlanItems } = usePlanActivityContext();
  const data = planItems.map(item => ({ ...item, key: item.planItem.id, label: item.planItem.name }));

  const keyExtractor = (item: PlanItemState) => `draggable-item-${item.planItem.id}`;

  const handlePlanListOrderChanged = ({ data }: DragEndParams<PlanItemState>) => {
    setPlanItems(data);
    updatePlanItemsOrder(data);
  };

  return (
    <FullScreenTemplate darkBackground extraStyles={styles.fullScreen}>
      <DraggableFlatList
        data={data}
        renderItem={({ item, getIndex, drag }: RenderItemParams<PlanItemState>) => {
          const index = getIndex();
          return (
            <View style={styles.tableContainer}>
              <TableRow
                item={item}
                border={index !== planItems.length - 1}
                key={index}
                drag={drag}
                navigation={navigation}
              />
            </View>
          );
        }}
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
