import {Card, IconButton, StyledText} from '../../../components';
import {i18n} from '../../../locale';
import {PlanItem, PlanItemType} from '../../../models';
import {Route} from '../../../navigation';
import React, { useEffect, useRef, useState } from 'react';
import {BackHandler, StyleSheet, ToastAndroid, View} from 'react-native';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {palette, typography} from '../../../styles';
import {PlanSlideItem} from './PlanSlideItem';

interface Props {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
};

export const RunPlanSlideScreen: React.FC<Props> = ({navigation, route}) => {
  const [state, setState] = useState({
    timerStop: false,
    planItems: [] as PlanItem[],
    pageNumber: route.params?.backPage ? route.params.backPage : 0,
    student: route.params?.student,
  });
  const completion = useRef<boolean[]>([]);

  const handleBackButton = () => {
    navigation.navigate(Route.Dashboard);
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    PlanItem.getPlanItems(route.params?.plan).then(planItems => {
      const pageNumber = planItems.findIndex(planItem => !planItem.completed);
      setState(prevState => ({
        ...prevState,
        planItems: planItems,
        pageNumber: pageNumber
      }));
      completion.current = planItems.map((item) => item.completed);
    });
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

  const markCompletion = (value: boolean) => {
    const updatedPlanItems = [...state.planItems];
    updatedPlanItems[state.pageNumber].completed = value;
    completion.current[state.pageNumber] = value;
    value ? updatedPlanItems[state.pageNumber].complete() : updatedPlanItems[state.pageNumber].uncomplete();
    setState(prevState => ({...prevState, planItems: updatedPlanItems}));
  };

  const nextPage = () => {
    markCompletion(true);
    const newIdx = state.planItems.findIndex((planItem, index) => !completion.current[index] && index > state.pageNumber);
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
    }
  };

  const goBack = async () => {
    markCompletion(false);
    if (state.pageNumber - 1 >= 0) {
      setState(prevState => ({ 
        ...prevState,
        pageNumber: prevState.pageNumber - 1 
      }));
    } else {
      navigation.navigate(Route.Dashboard);
    }
  };

  const timeout = useRef<NodeJS.Timeout>();

  const onPressIn = () => {
    timeout.current = setTimeout(() => {
      ToastAndroid.show(i18n.t('runPlan:oneSecondMore'), ToastAndroid.SHORT);
    }, 700);
  };

  const onPressOut = () => {
    clearTimeout(timeout.current);
  };

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
        </Card>
      </View>
    );
  };

  const renderLoader = () => {
    return <StyledText>{i18n.t('runPlan:wait')}</StyledText>;
  };

  return state.planItems.length ? renderPlan() : renderLoader();
};

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
