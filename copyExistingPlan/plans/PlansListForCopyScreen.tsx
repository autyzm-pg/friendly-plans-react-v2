import React, { FC, useState, useEffect } from 'react';
import { BackHandler, StyleSheet } from 'react-native';

import { IconButton, NarrowScreenTemplate } from '../../components';
import { i18n } from '../../locale';
import { Route } from '../../navigation';
import { dimensions, palette } from '../../styles';
import { PlansListForCopy } from './PlansListForCopy';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { Plan } from '../../models';

interface Props {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}

export const PlansListForCopyScreen: FC<Props> = ({ navigation, route }) => {
  const [plans, setPlans] = useState<Plan[]>([]);

  const [collections, setCollections] = useState<number[]>([]);

  useEffect(() => {
    getPlans();
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonPressAndroid);
    return () => {
      handleBackButtonPressAndroid();
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonPressAndroid);
    }
  }, []);

  const getPlans = async () => {
    const plans = await Plan.getPlans(route.params?.student.id);
    setPlans(plans)
  }

  const canNavigateBack = (): boolean => {
    return route.params?.canNavigateBack !== false;
  }

  const getScreenTitle = () => {
    return i18n.t('planList:copyPlanScreenTitle');
  };

  const navigateToPlansSearch = () => {
    navigation.navigate(Route.PlanSearchForCopy, {
      plans: plans,
    });
  };

  const handleNavigateToCreateStudent = () => {
    navigation.navigate(Route.StudentCreate);
  };

  const handleBackButtonPressAndroid = () => {
    if (!navigation.isFocused()) {
      return false;
    }
    return !canNavigateBack();
  };

  const renderHeaderButtons = () => {
    return (
      <>
        <IconButton
          containerStyle={styles.iconContainer}
          name="person-add"
          type="material"
          size={24}
          color={palette.textWhite}
          onPress={handleNavigateToCreateStudent}
        />
        <IconButton
          containerStyle={styles.iconContainer}
          name="search"
          type="material"
          size={24}
          color={palette.textWhite}
          onPress={navigateToPlansSearch}
        />
      </>
    );
  }

  return (
    <NarrowScreenTemplate
      canNavigateBack={canNavigateBack()}
      title={getScreenTitle()}
      navigation={navigation}
      buttons={renderHeaderButtons()}
    >
      <PlansListForCopy plans={plans} navigation={navigation}/>
    </NarrowScreenTemplate>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    paddingHorizontal: dimensions.spacingSmall,
  },
});
