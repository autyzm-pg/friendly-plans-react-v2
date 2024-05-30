import {Card, FlatButton, IconButton, StyledText} from '../../../components';
import {i18n} from '../../../locale';
import {ModelSubscriber, PlanItem, PlanItemType, Student} from '../../../models';
import {Route} from '../../../navigation';
import React, { useEffect, useRef, useState } from 'react';
import {BackHandler, StyleSheet, Text, ToastAndroid, TouchableHighlight, TouchableHighlightComponent, View} from 'react-native';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {palette, typography} from '../../../styles';
import {PlanSlideItem} from './PlanSlideItem';

interface State {
  planItems: PlanItem[];
  pageNumber: number;
  student: Student;
  timerStop: boolean;
}

interface Props {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}

export const RunPlanSlideScreen: React.FC<Props> = ({navigation, route}) => {
  const navigationOptions = {
    header: null,
  };

  const [state, setState] = useState({
    timerStop: false,
    planItems: [] as PlanItem[],
    pageNumber: route.params?.backPage ? route.params.backPage : 0,
    student: route.params?.student,
  });

  const handleBackButton = () => {
    navigation.navigate(Route.Dashboard);
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    PlanItem.getPlanItems(route.params?.plan).then(planItems => {
      const pageNumber = planItems.findIndex(planItem => !planItem.completed);
      //const filteredPlanItems = planItems.filter(item => !item.completed);
      setState(prevState => ({
        ...prevState,
        planItems: planItems,
        pageNumber: pageNumber
      }));
    })
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (route.params?.backPage) {
      setState(prevState => ({
        ...prevState,
        pageNumber: route.params?.backPage
      }));
      navigation.setParams({'backPage': null})
    }

    if (route.params?.timerStop !== null) {
      setState(prevState => ({
        ...prevState,
        timerStop: route.params?.timerStop
      }));
      navigation.setParams({'timerStop': null});
    }
  }, [route, state, navigation]);

  const markItemPlanAsCompleted = () => {
    const planItemToUpdate = state.planItems[state.pageNumber];
    planItemToUpdate.completed = true;
    planItemToUpdate.complete();
  };

  const markItemPlanAsUncompleted = () => {
    const planItemToUpdate = state.planItems[state.pageNumber];
    planItemToUpdate.completed = false;
    planItemToUpdate.uncomplete();
  }

  const setCurrentPageNumber = () => {
    
  }

  const nextPage = () => {
    markItemPlanAsCompleted();
    const newIdx = state.planItems.findIndex((planItem, index) => !planItem.completed && index > state.pageNumber);
    if(state.planItems[state.pageNumber].type !== PlanItemType.ComplexTask) {
      if (newIdx !== -1) {
        setState(prevState => ({ 
          ...prevState,
          pageNumber: newIdx
        }));
      } else {
        navigation.navigate(Route.Dashboard);
      }
    } else {

      navigation.navigate(Route.RunSubPlanSlide, {
        pageNumber: state.pageNumber,
        nextPageNumber: newIdx !== -1 ? newIdx : state.planItems.length,
        planItem: state.planItems[state.pageNumber],
        planItemsAmount: state.planItems.length,
        student: route.params?.student,
      });

      // if (state.pageNumber + 1 < state.planItems.length) {
      //   setState(state => ({ pageNumber: state.pageNumber + 1 }));
      // }
    }
  };

  const goBack = async () => {
    markItemPlanAsUncompleted();
    if (state.pageNumber - 1 >= 0) {
      setState(prevState => ({ 
        ...prevState,
        pageNumber: prevState.pageNumber - 1 
      }));
      // if (state.planItems[state.pageNumber-1].type !== PlanItemType.ComplexTask) {

      // } else {
        
      //   navigation.navigate(Route.RunSubPlanSlide, {
      //     pageNumber: state.pageNumber-1,
      //     planItem: state.planItems[state.pageNumber],
      //     planItemsAmount: state.planItems.length,
      //     student: route.params?.student,
      //   });
      //   setState(prevState => ({ 
      //     ...prevState,
      //     timerStop: true
      //   }));
      // }
    } else {
      navigation.navigate(Route.Dashboard);
    }
  };

  const timeout = useRef<NodeJS.Timeout>();

  const onPressIn = () => {
    timeout.current = setTimeout(() => {
      ToastAndroid.show(i18n.t('runPlan:oneSecondMore'), ToastAndroid.SHORT);
    }, 700)
  }

  const onPressOut = () => {
    clearTimeout(timeout.current)
  }

  const renderPlan = () => {
    const { student } = state;
    return (
      <View style={styles.container}>
        <Card style={styles.slide}>
          <View style={styles.planItem}>
            <PlanSlideItem
              type={student.displaySettings}
              planItem={state.planItems[state.pageNumber]}
              index={state.pageNumber}
              textSize={state.student.textSize}
              isUpperCase={state.student.isUpperCase}
              timerStop={state.timerStop}
            />
          </View>
          {/*<Text>{state.pageNumber}</Text>*/}
          <View style={styles.containerForArrows}>
            <IconButton name="arrow-back"
                        type="material"
                        size={50}
                        color="#E7DCDA"
                        onPressIn={onPressIn}
                        onPressOut={onPressOut}
                        onLongPress={goBack}
                        delayLongPress={2000}
            />

            <IconButton name="arrow-bold-right"
                        type="entypo"
                        size={120}
                        color={palette.playButton}
                        onPress={nextPage}
            />
          </View>

          {/*<FlatButton style={styles.button} onPress={nextPage} title={i18n.t('runPlan:next')} />*/}
        </Card>
      </View>
    );
  };

  const renderLoader = () => {
    return <StyledText>{i18n.t('runPlan:wait')}</StyledText>;
  };


  return state.planItems.length ? renderPlan() : renderLoader();
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
