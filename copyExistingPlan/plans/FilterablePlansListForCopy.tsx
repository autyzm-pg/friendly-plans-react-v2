import {Plan} from '../../models';
import React, {FC} from 'react';
import { View } from 'react-native';
import {PlanListElementForCopy} from './PlanListElementForCopy';
import { NavigationProp } from '@react-navigation/native';

interface Props {
  plans: Plan[];
  searchQuery: string;
  navigation: NavigationProp<any>;
}

export const FilterablePlansListForCopy: FC<Props> = ({ plans, searchQuery, navigation }) => {
  const filteredPlans: Plan[] = plans
    .filter(plan => plan.name.match(new RegExp(searchQuery, 'i')))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <View>
      {filteredPlans.map(plan => (
        <PlanListElementForCopy plan={plan} key={plan.id} navigation={navigation} />
      ))}
    </View>
  );
};
