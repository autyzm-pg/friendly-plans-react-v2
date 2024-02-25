import {Separator, StyledText} from 'components';
import {sortBy} from 'lodash';
import {Plan} from 'models';
import React, {FunctionComponent} from 'react';
import {StyleSheet, View} from 'react-native';
import {dimensions, palette, typography} from 'styles';
import {PlanListElementForCopy} from './PlanListElementForCopy';


interface Props {
  plans: Plan[];
}



export const PlansListForCopy: FunctionComponent<Props> = ({plans}) => {


  const renderLetterGroupLabel = (letter: string) => (
    <StyledText key={letter} style={styles.label}>
      {letter}
    </StyledText>
  );


  const sortedPlans = sortBy(plans, (plan: Plan) => plan.name);
  const plansLetterGrouped = sortedPlans.reduce((grouped: { [key: string]: Element[] }, plan: Plan) => {
    const firstLetter = plan.name.charAt(0).toLowerCase();
    const shouldRenderSeparator = !grouped[firstLetter] && !!Object.keys(grouped).length;

    const planEntry = <PlanListElementForCopy plan={plan} key={plan.id}/>;

    grouped[firstLetter] = grouped[firstLetter]
      ? [...grouped[firstLetter], planEntry]
      : [renderLetterGroupLabel(firstLetter), planEntry];

    if (shouldRenderSeparator) {
      grouped[firstLetter].unshift(<Separator key={`spearator-${firstLetter}`} extraWide />);
    }

    return grouped;
  }, {});

  return <View>{Object.values(plansLetterGrouped).flat()}</View>;
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
