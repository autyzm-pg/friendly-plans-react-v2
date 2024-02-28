import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import { NavigationInjectedProps } from '@react-navigation/native';

import {Card, FlatButton, IconButton, StyledText} from 'components';
import { i18n } from 'locale';
import {ModelSubscriber, PlanItem, PlanSubItem, Student} from 'models';
import { Route } from '../navigation';
import { palette, typography } from '../styles';
import {SubPlanSlideItem} from './SubPlanSlideItem';

interface State {
  pageNumber: number;
  planItem: PlanItem;
  planItemsAmount: number;
  student: Student;
  planSubItems: PlanSubItem[];
  subPageNumber: number;
}

export class RunSubPlanSlideScreen extends React.PureComponent<NavigationInjectedProps, State> {
  static navigationOptions = {
    header: null,
  };

  studentSubscriber: ModelSubscriber<Student> = new ModelSubscriber();
  planItemsSubscriber: ModelSubscriber<PlanSubItem> = new ModelSubscriber();
  state: Readonly<State> = {
    pageNumber: this.props.navigation.getParam('pageNumber'),
    planItem: this.props.navigation.getParam('planItem'),
    planItemsAmount: this.props.navigation.getParam('planItemsAmount'),
    student: this.props.navigation.getParam('student'),
    planSubItems: [],
    subPageNumber: this.props.navigation.getParam('startPage') ? this.props.navigation.getParam('startPage') : 0,
  };

  componentDidMount() {
    const student = this.props.navigation.getParam('student');
    const planItem = this.props.navigation.getParam('planItem');

    this.planItemsSubscriber.subscribeCollectionUpdates(planItem, planSubItems => {
      if (planSubItems.length <= 0) {
        this.props.navigation.navigate(Route.Dashboard);
      }
      planSubItems.sort((a: PlanSubItem, b: PlanSubItem) => a.order > b.order ? 1 : -1);
      this.setState({ planSubItems });
    });
    this.studentSubscriber.subscribeElementUpdates(student, updatedStudent =>
      this.setState({ student: updatedStudent }),
    );
  }

  componentWillUnmount() {
    this.planItemsSubscriber.unsubscribeCollectionUpdates();
    this.studentSubscriber.unsubscribeElementUpdates();
  }

  nextPage = () => {
    if (this.state.subPageNumber + 1 < this.state.planSubItems.length) {
      this.setState(state => ({ subPageNumber: state.subPageNumber + 1 }));
    } else {
      this.whereNavigate();
    }
  };

  whereNavigate = () => {
    if (this.state.pageNumber + 1 >= this.state.planItemsAmount){
      this.props.navigation.navigate(Route.Dashboard);
    } else {
      this.props.navigation.navigate(Route.RunPlanSlide, {backPage: this.state.pageNumber + 1, timerStop: false});
    }
  };

  goBack = () => {
    if (this.state.subPageNumber - 1 >= 0) {
      this.setState(state => ({ subPageNumber: state.subPageNumber - 1 }));
    } else {
      this.props.navigation.navigate(Route.RunPlanSlide, {backPage: this.state.pageNumber, timerStop: false});
    }
  };

  renderPlan = () => {
    const { student } = this.state;
    return (
      <View style={styles.container}>
        <Card style={styles.slide}>
          <View style={styles.planItem}>
            <SubPlanSlideItem
              type={student.displaySettings}
              planSubItem={this.state.planSubItems[this.state.subPageNumber]}
              index={this.state.subPageNumber}
              textSize={this.state.student.textSize}
              isUpperCase={this.state.student.isUpperCase}
              planItem={this.state.planItem}
            />
            {/*<Text>{this.state.pageNumber}</Text>*/}
          </View>
          <View style={styles.containerForArrows}>
            <IconButton name="arrow-back"
                        type="material"
                        size={50}
                        color="#E7DCDA"
                        onLongPress={this.goBack}
                        delayLongPress={2000}
            />
            <IconButton name="arrow-bold-right"
                        type="entypo"
                        size={120}
                        color={palette.playButton}
                        onPress={this.nextPage}
            />
          </View>
          {/*<FlatButton style={styles.button} onPress={this.nextPage} title={i18n.t('runPlan:next')} />*/}
        </Card>
      </View>
    );
  };

  renderLoader = () => {
    return <StyledText>{i18n.t('runPlan:wait')}</StyledText>;
  };

  render() {
    return this.state.planSubItems.length ? this.renderPlan() : this.renderLoader();
  }
}

const styles = StyleSheet.create({
  containerForArrows: {
    backgroundColor: palette.background,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    backgroundColor: palette.backgroundSurface,
  },
  slide: {
    flex: 1,
    backgroundColor: palette.background,
    margin: 20,
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
  },
  button: {
    flex: 1,
    backgroundColor: palette.primaryVariant,
  },
  buttonText: {
    color: palette.textWhite,
    margin: 10,
  },
  planItem: {
    flex: 1,
    alignItems: 'center',
    color: palette.textBlack,
    ...typography.title,
  },
});
