import {Card, FlatButton, IconButton, StyledText} from 'components';
import {i18n} from 'locale';
import {ModelSubscriber, PlanItem, PlanItemType, Student} from 'models';
import {Route} from '../navigation';
import React from 'react';
import {StyleSheet, Text, TouchableHighlight, TouchableHighlightComponent, View} from 'react-native';
import {NavigationInjectedProps} from '@react-navigation/native';
import {palette, typography} from '../styles';
import {PlanSlideItem} from './PlanSlideItem';

interface State {
  planItems: PlanItem[];
  pageNumber: number;
  student: Student;
  timerStop: boolean;
}

export class RunPlanSlideScreen extends React.PureComponent<NavigationInjectedProps, State> {
  static navigationOptions = {
    header: null,
  };

  studentSubscriber: ModelSubscriber<Student> = new ModelSubscriber();
  planItemsSubscriber: ModelSubscriber<PlanItem> = new ModelSubscriber();
  state: Readonly<State> = {
    timerStop: false,
    planItems: [],
    pageNumber: this.props.navigation.getParam('backPage') ? this.props.navigation.getParam('backPage') : 0,
    student: this.props.navigation.getParam('student'),
  };

  componentDidMount() {
    const student = this.props.navigation.getParam('student');
    const plan = this.props.navigation.getParam('plan');

    this.planItemsSubscriber.subscribeCollectionUpdates(plan, planItems => this.setState({ planItems }));
    this.studentSubscriber.subscribeElementUpdates(student, updatedStudent =>
      this.setState({ student: updatedStudent }),
    );
  }

  componentWillUnmount() {
    this.planItemsSubscriber.unsubscribeCollectionUpdates();
    this.studentSubscriber.unsubscribeElementUpdates();
  }

  componentDidUpdate(prevProps: Readonly<NavigationInjectedProps>, prevState: Readonly<State>, snapshot?: any) {
    if (this.props.navigation.getParam('backPage')) {
      this.setState({pageNumber: this.props.navigation.getParam('backPage')});
      this.props.navigation.setParams({'backPage': null});
    }

    if (this.props.navigation.getParam('timerStop') !== null) {
      this.setState({timerStop: this.props.navigation.getParam('timerStop')});
      this.props.navigation.setParams({'timerStop': null});
    }
  }

  nextPage = () => {
    if(this.state.planItems[this.state.pageNumber].type !== PlanItemType.ComplexTask) {
      if (this.state.pageNumber + 1 < this.state.planItems.length) {
        this.setState(state => ({ pageNumber: state.pageNumber + 1 }));
      } else {
        this.props.navigation.navigate(Route.Dashboard);
      }
    } else {

      this.props.navigation.navigate(Route.RunSubPlanSlide, {
        pageNumber: this.state.pageNumber,
        planItem: this.state.planItems[this.state.pageNumber],
        planItemsAmount: this.state.planItems.length,
        student: this.props.navigation.getParam('student'),
      });

      // if (this.state.pageNumber + 1 < this.state.planItems.length) {
      //   this.setState(state => ({ pageNumber: state.pageNumber + 1 }));
      // }
    }

  };

  goBack = async () => {
    if (this.state.pageNumber - 1 >= 0) {
      if (this.state.planItems[this.state.pageNumber-1].type !== PlanItemType.ComplexTask) {
        this.setState(state => ({ pageNumber: state.pageNumber - 1 }));
      } else {
        const collection = await this.state.planItems[this.state.pageNumber-1].getChildCollectionRef().get();
        this.props.navigation.navigate(Route.RunSubPlanSlide, {
          pageNumber: this.state.pageNumber - 1,
          planItem: this.state.planItems[this.state.pageNumber-1],
          planItemsAmount: this.state.planItems.length,
          student: this.props.navigation.getParam('student'),
          startPage: collection.size - 1,
        });

        this.setState({timerStop: true});

      }
    } else {
      this.props.navigation.navigate(Route.Dashboard);
    }
  };


  renderPlan = () => {
    const { student } = this.state;
    return (
      <View style={styles.container}>
        <Card style={styles.slide}>
          <View style={styles.planItem}>
            <PlanSlideItem
              type={student.displaySettings}
              planItem={this.state.planItems[this.state.pageNumber]}
              index={this.state.pageNumber}
              textSize={this.state.student.textSize}
              isUpperCase={this.state.student.isUpperCase}
              timerStop={this.state.timerStop}
            />
          </View>
          {/*<Text>{this.state.pageNumber}</Text>*/}
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
    return this.state.planItems.length ? this.renderPlan() : this.renderLoader();
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
