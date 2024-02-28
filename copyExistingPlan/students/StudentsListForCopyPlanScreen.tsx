import React from 'react';
import { BackHandler, StyleSheet } from 'react-native';
import { NavigationInjectedProps } from '@react-navigation/native';

import { IconButton, NarrowScreenTemplate } from 'components';
import { i18n } from 'locale';
import {AuthUser, ModelSubscriber, Student} from 'models';
import { Route } from 'navigation';
import { dimensions, palette } from 'styles';
import { StudentsListForCopyPlan } from './StudentsListForCopyPlan';

interface State {
  students: Student[];
  collections: number[];
}

export class StudentsListForCopyPlanScreen extends React.PureComponent<NavigationInjectedProps, State> {
  modelSubscriber: ModelSubscriber<Student> = new ModelSubscriber();

  state: State = {
    students: [],
    collections: [],
  };

  componentDidMount() {
      this.modelSubscriber.subscribeCollectionUpdates(AuthUser.getAuthenticatedUser(), (students: Student[]) => {

        for (const student of students){
          student.getCollectionCount((count: number) => {
            student.setCollectionCount(count);
            this.setState({collections: [1]});
          });
        }

        this.setState({ students });

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

  navigateToStudentsSearch = () => {
    this.props.navigation.navigate(Route.StudentsListSearchForCopyPlan, {
      students: this.state.students,
    });
  };

  get screenName(): string {
    return i18n.t('studentList:screenTitle');
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
          onPress={this.navigateToStudentsSearch}
        />
      </>
    );
  }

  get canNavigateBack(): boolean {
    return this.props.navigation.getParam('canNavigateBack') !== false;
  }

  render() {
    const { navigation } = this.props;
    const { students } = this.state;

    return (
      <NarrowScreenTemplate
        canNavigateBack={this.canNavigateBack}
        title={this.screenName}
        navigation={navigation}
        buttons={this.renderHeaderButtons()}
      >
        <StudentsListForCopyPlan students={students} />
      </NarrowScreenTemplate>
    );
  }



}

const styles = StyleSheet.create({
  iconContainer: {
    paddingHorizontal: dimensions.spacingSmall,
  },
});
