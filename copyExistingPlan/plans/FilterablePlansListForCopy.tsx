import {Plan} from 'models';
import React, {FunctionComponent} from 'react';
import { View } from 'react-native';
import {PlanListElementForCopy} from './PlanListElementForCopy';

interface Props {
  plans: Plan[];
  searchQuery: string;
}

export const FilterablePlansListForCopy: FunctionComponent<Props> = ({ plans, searchQuery }) => {
  const filteredPlans: Plan[] = plans
    .filter(plan => plan.name.match(new RegExp(searchQuery, 'i')))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <View>
      {filteredPlans.map(plan => (
        <PlanListElementForCopy plan={plan} key={plan.id} />
      ))}
    </View>
  );
};
