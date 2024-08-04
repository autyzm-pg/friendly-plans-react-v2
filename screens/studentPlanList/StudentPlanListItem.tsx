import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, TouchableHighlight, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { NavigationProp } from '@react-navigation/native';

import { Card, Emoji, Icon, StyledText, PlayButton } from '../../components';
import { i18n } from '../../locale';
import { ModelSubscriber, Plan, PlanItem, PlanItemType, PlanSubItem } from '../../models';
import { Route } from '../../navigation';
import { dimensions, palette, typography } from '../../styles';
import { useRootNavigatorContext } from '../../contexts/RootNavigatorContext';
import { useCurrentStudentContext } from '../../contexts/CurrentStudentContext';

interface Props {
  plan: Plan;
  navigation: NavigationProp<any>;
  updatePlans: () => void;
}

const StudentPlanListItem: React.FC<Props> = ({ navigation, plan, updatePlans }) => {
  const [isSwipeableOpen, setIsSwipeableOpen] = useState<boolean>(false);
  const { emoji, name } = plan;

  const { editionMode } = useRootNavigatorContext();
  const {currentStudent} = useCurrentStudentContext();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setIsSwipeableOpen(false);
    });
    return unsubscribe;
  }, [navigation]);

  const navigateToUpdatePlan = () => {    
    navigation.navigate(Route.PlanActivity, {
      currentStudent,
      plan,
    });
  };

  const renderRightActions = () => {
    return (
      <View style={[styles.deleteContainer]}>
        <Icon name="delete" onPress={handlePressDelete} />
      </View>
    );
  };

  const handleOpenSwipeable = () => setIsSwipeableOpen(true);

  const handleCloseSwipeable = () => setIsSwipeableOpen(false);

  const deletePlan = () => {
    Plan.deletePlan(plan).then(() => {
      updatePlans()
    })
  }

  const handlePressDelete = () =>
    Alert.alert(i18n.t('planList:deletePlan'), i18n.t('planList:deletePlanDescription'), [
      { text: i18n.t('common:cancel') },
      {
        text: i18n.t('common:confirm'),
        onPress: deletePlan,
      },
    ]);

  const swipeableRef = useRef<Swipeable>(null);

  const handleLongPress = () => {
    if (swipeableRef.current) {
      swipeableRef.current.openRight();
    }
  };
  
  const changeState = async(item: PlanItem) => {
    await PlanItem.updatePlanItem(item);
    if (item.type === PlanItemType.ComplexTask) {
      await PlanSubItem.getPlanSubItems(item).then(subItems => {
        subItems.forEach(async(subItem) => {
          subItem.completed = item.completed;
          await PlanSubItem.updatePlanSubItem(subItem);
        });
      });
    };
  };

  const markPlanItemsAsNotCompleted = async () => {
    const planItems = await PlanItem.getPlanItems(plan);
    planItems.map((item) => {
      item.uncomplete();
    });
  };

  const runPlanFromBeginning = async () => {
    await markPlanItemsAsNotCompleted();
  }


  return (
    <View style={styles.container}>
    <TouchableHighlight
      onPress={isSwipeableOpen ? handlePressDelete : navigateToUpdatePlan}
      underlayColor="transparent"
      disabled={!editionMode}
      onLongPress={handleLongPress}
    >
      <Swipeable
        ref={swipeableRef}
        enabled={editionMode}
        renderRightActions={renderRightActions}
        onSwipeableWillOpen={(direction) => {if (direction === 'right') handleOpenSwipeable}}
        onSwipeableWillClose={handleCloseSwipeable}
      >
        <Card style={[styles.card, isSwipeableOpen && styles.swipeableContainerOpen]}>
          <View style={styles.cardTextContainer}>
            {!isSwipeableOpen && <Emoji symbol={emoji} />}
            <StyledText style={styles.cardText} ellipsizeMode='tail' numberOfLines={2}>{name}</StyledText>
          </View>
          {!isSwipeableOpen && 
            <PlayButton 
              plan={plan} 
              size={50} 
              navigation={navigation} 
              student={currentStudent} 
              runPlanFromBeginning={runPlanFromBeginning}
            />
          }
        </Card>
      </Swipeable>
    </TouchableHighlight>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '50%',
  },
  swipeableContainerOpen: {
    paddingHorizontal: 50,
  },
  rightActions: {
    backgroundColor: palette.backgroundSurface,
    width: 20,
  },
  card: {
    height: 72,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: dimensions.spacingSmall,
    zIndex: 1
  },
  cardText: {
    ...typography.subtitle,
    color: palette.textBody,
    marginLeft: dimensions.spacingBig,
  },
  cardTextContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1
  },
  deleteContainer: {
    backgroundColor: palette.purpleLightGray,
    height: 72,
    width: '10%',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    justifyContent: 'center',
    marginTop: 12,
    marginRight: 10,
  },
});

export default StudentPlanListItem;
