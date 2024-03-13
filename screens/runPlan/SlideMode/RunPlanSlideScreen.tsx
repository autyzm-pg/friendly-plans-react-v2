import {Card, FlatButton, IconButton, StyledText} from '../../../components';
import {i18n} from '../../../locale';
import {ModelSubscriber, PlanItem, PlanItemType, Student} from '../../../models';
import {Route} from '../../../navigation';
import React, { useEffect, useState } from 'react';
import {StyleSheet, Text, TouchableHighlight, TouchableHighlightComponent, View} from 'react-native';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {palette, typography} from '../../../styles';
import {PlanSlideItem} from './PlanSlideItem';
import { defaults } from "../../../mocks/defaults";

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

  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      planItems: defaults.planItemsList
    }));
  }, [])

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

  const nextPage = () => {
    if(state.planItems[state.pageNumber].type !== PlanItemType.ComplexTask) {
      if (state.pageNumber + 1 < state.planItems.length) {
        setState(prevState => ({ 
          ...prevState,
          pageNumber: prevState.pageNumber + 1 
        }));
      } else {
        navigation.navigate(Route.Dashboard);
      }
    } else {

      navigation.navigate(Route.RunSubPlanSlide, {
        pageNumber: state.pageNumber,
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
    if (state.pageNumber - 1 >= 0) {
      if (state.planItems[state.pageNumber-1].type !== PlanItemType.ComplexTask) {
        setState(prevState => ({ 
          ...prevState,
          pageNumber: prevState.pageNumber - 1 
        }));
      } else {
        const collection = await state.planItems[state.pageNumber-1].getChildCollectionRef().get();
        navigation.navigate(Route.RunSubPlanSlide, {
          pageNumber: state.pageNumber - 1,
          planItem: state.planItems[state.pageNumber-1],
          planItemsAmount: state.planItems.length,
          student: route.params?.student,
          startPage: collection.size - 1,
        });
        setState(prevState => ({ 
          ...prevState,
          timerStop: true
        }));
      }
    } else {
      navigation.navigate(Route.Dashboard);
    }
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
          {/*<Text>{state.pageNumber}</Text>*/}
          <View style={styles.containerForArrows}>
            <IconButton name="arrow-back"
                        type="material"
                        size={50}
                        color="#E7DCDA"
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
