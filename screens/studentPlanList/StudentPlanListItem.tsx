import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, TouchableHighlight, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { NavigationProp } from '@react-navigation/native';

import { Card, Emoji, Icon, StyledText, PlayButton } from '../../components';
import { i18n } from '../../locale';
import { ModelSubscriber, Plan, Student } from '../../models';
import { Route } from '../../navigation';
import { dimensions, palette, typography } from '../../styles';
import { useRootNavigatorContext } from '../../contexts/RootNavigatorContext';

interface Props {
  plan: Plan;
  student: Student;
  navigation: NavigationProp<any>;
}

const StudentPlanListItem: React.FC<Props> = ({ navigation, plan, student }) => {
  const [isSwipeableOpen, setIsSwipeableOpen] = useState<boolean>(false);
  const { emoji, name } = plan;

  const { editionMode } = useRootNavigatorContext();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setIsSwipeableOpen(false);
    });
    return unsubscribe;
  }, [navigation]);

  const navigateToUpdatePlan = () => {    
    navigation.navigate(Route.PlanActivity, {
      student,
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

  const handlePressDelete = () =>
    Alert.alert(i18n.t('planList:deletePlan'), i18n.t('planList:deletePlanDescription'), [
      { text: i18n.t('common:cancel') },
      {
        text: i18n.t('common:confirm'),
        onPress: plan.delete,
      },
    ]);

  return (
    <View style={styles.container}>
    <TouchableHighlight
      onPress={isSwipeableOpen ? handlePressDelete : navigateToUpdatePlan}
      underlayColor="transparent"
      disabled={!editionMode}
    >
      <Swipeable
        enabled={editionMode}
        renderRightActions={renderRightActions}
        onSwipeableWillOpen={(direction) => {if (direction === 'right') handleOpenSwipeable}}
        onSwipeableWillClose={handleCloseSwipeable}
      >
        <Card style={[styles.card, isSwipeableOpen && styles.swipeableContainerOpen]}>
          <View style={styles.cardTextContainer}>
            {!isSwipeableOpen && <Emoji symbol={emoji} />}
            <StyledText style={styles.cardText}>{name}</StyledText>
          </View>
          {!isSwipeableOpen && <PlayButton plan={plan} size={50} navigation={navigation} student={student} />}
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
