import {Separator, StyledText} from '../../components';
import {sortBy} from 'lodash';
import {Plan} from '../../models';
import React, {FC, ReactElement} from 'react';
import {StyleSheet, View} from 'react-native';
import {dimensions, palette, typography} from '../../styles';
import {PlanListElementForCopy} from './PlanListElementForCopy';
import {NavigationProp} from '@react-navigation/native';

interface Props {
  plans: Plan[];
  navigation: NavigationProp<any>;
}

export const PlansListForCopy: FC<Props> = ({plans, navigation}) => {

  const renderLetterGroupLabel = (letter: string) => (
    <StyledText key={letter} style={styles.label}>
      {letter}
    </StyledText>
  );


  const sortedPlans = sortBy(plans, (plan: Plan) => plan.name);
  const plansLetterGrouped = sortedPlans.reduce((grouped: { [key: string]: Element[] }, plan: Plan) => {
    const firstLetter = plan.name.charAt(0).toLowerCase();
    const shouldRenderSeparator = !grouped[firstLetter] && !!Object.keys(grouped).length;

    const planEntry = <PlanListElementForCopy plan={plan} key={plan.id} navigation={navigation}/>;

    grouped[firstLetter] = grouped[firstLetter]
      ? [...grouped[firstLetter], planEntry]
      : [renderLetterGroupLabel(firstLetter), planEntry];

    if (shouldRenderSeparator) {
      grouped[firstLetter].unshift(<Separator key={`spearator-${firstLetter}`} extraWide />);
    }

    return grouped;
  }, {});

  return <View>{Object.values(plansLetterGrouped).flat() as ReactElement[]}</View>;
};

const styles = StyleSheet.create({
  label: {
    ...typography.overline,
    color: palette.textDisabled,
    textTransform: 'uppercase',
  },
  studentName: {
    ...typography.subtitle,
    color: palette.textBody,
    marginTop: dimensions.spacingSmall,
    marginBottom: dimensions.spacingSmall,
  },
});
