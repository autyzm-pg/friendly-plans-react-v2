import React from 'react';
import { BackHandler, StyleSheet } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';

import { IconButton, NarrowScreenTemplate } from 'components';
import { i18n } from 'locale';
import { ModelSubscriber, Plan } from 'models';
import { Route } from 'navigation';
import { dimensions, palette } from 'styles';
import { PlansListForCopy } from './PlansListForCopy';

interface State {
  plans: Plan[];
  collections: number[];
}

export class PlansListForCopyScreen extends React.PureComponent<NavigationInjectedProps, State> {
  modelSubscriber: ModelSubscriber<Plan> = new ModelSubscriber();

  state: State = {
    plans: [],
    collections: [],
  };

  componentDidMount() {
    const student = this.props.navigation.getParam('student');
    this.modelSubscriber.subscribeCollectionUpdates(student, (plans: Plan[]) => {
        this.setState({ plans });
    });

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonPressAndroid);
  }




  componentWillUnmount() {
    this.modelSubscriber.unsubscribeCollectionUpdates();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonPressAndroid);
  }

  handleBackButtonPressAndroid = () => {
    if (!this.props.navigation.isFocused()) {
      return false;
    }
    return !this.canNavigateBack;
  };

  navigateToPlansSearch = () => {
    this.props.navigation.navigate(Route.PlanSearchForCopy, {
      plans: this.state.plans,
    });
  };

  get screenName(): string {
    return i18n.t('planList:copyPlanScreenTitle');
  }

  handleNavigateToCreateStudent = () => {
    this.props.navigation.navigate(Route.StudentCreate);
  };



  renderHeaderButtons() {
    return (
      <>
        <IconButton
          containerStyle={styles.iconContainer}
          name="person-add"
          type="material"
          size={24}
          color={palette.textWhite}
          onPress={this.handleNavigateToCreateStudent}
        />
        <IconButton
          containerStyle={styles.iconContainer}
          name="search"
          type="material"
          size={24}
          color={palette.textWhite}
          onPress={this.navigateToPlansSearch}
        />
      </>
    );
  }

  get canNavigateBack(): boolean {
    return this.props.navigation.getParam('canNavigateBack') !== false;
  }

  render() {
    const { navigation } = this.props;
    const { plans } = this.state;

    return (
      <NarrowScreenTemplate
        canNavigateBack={this.canNavigateBack}
        title={this.screenName}
        navigation={navigation}
        buttons={this.renderHeaderButtons()}
      >
        <PlansListForCopy plans={plans} />
      </NarrowScreenTemplate>
    );
  }



}

const styles = StyleSheet.create({
  iconContainer: {
    paddingHorizontal: dimensions.spacingSmall,
  },
});
