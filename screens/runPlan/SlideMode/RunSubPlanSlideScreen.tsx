import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';

import { Card, IconButton, StyledText } from '../../../components';
import { i18n } from '../../../locale';
import { PlanSubItem } from '../../../models';
import { Route } from '../../../navigation';
import { palette, typography } from '../../../styles';
import { SubPlanSlideItem } from './SubPlanSlideItem';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { useCurrentStudentContext } from '../../../contexts/CurrentStudentContext';

interface Props {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
};

export const RunSubPlanSlideScreen: React.FC<Props> = ({navigation, route}) => {
  const {currentStudent} = useCurrentStudentContext();

  const [state, setState] = useState({
    nextPageNumber: route.params?.nextPageNumber,
    pageNumber: route.params?.pageNumber,
    planItem: route.params?.planItem,
    planItemsAmount: route.params?.planItemsAmount,
    student: currentStudent ?? route.params?.student,
    planSubItems: [] as PlanSubItem[],
    subPageNumber: 0,
  });

  useEffect(() => {
    PlanSubItem.getPlanSubItems(state.planItem).then(subItems => {
      setState(prevState => ({
        ...prevState,
        planSubItems: subItems
      }));
    })
  }, [])

  const nextPage = () => {
    if (state.subPageNumber + 1 < state.planSubItems?.length) {
      setState(prevState => ({ 
        ...prevState,
        subPageNumber: prevState.subPageNumber + 1 
      }));
    } else {
      whereNavigate();
    }
  };

  const whereNavigate = () => {
    if (state.nextPageNumber >= state.planItemsAmount){
      navigation.navigate(Route.Dashboard);
    } else {
      navigation.navigate(Route.RunPlanSlide, {backPage: state.nextPageNumber, timerStop: false});
    }
  };

  const goBack = () => {
    if (state.subPageNumber - 1 >= 0) {
      setState(prevState => ({ 
        ...prevState,
        subPageNumber: state.subPageNumber - 1
      }));
    } else {
      navigation.navigate(Route.RunPlanSlide, {backPage: state.pageNumber, timerStop: false});
    }
  };

  const timeout = useRef<NodeJS.Timeout>();

  const onPressIn = () => {
    timeout.current = setTimeout(() => {
      ToastAndroid.show(i18n.t('runPlan:oneSecondMore'), ToastAndroid.SHORT);
    }, 900);
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
            <SubPlanSlideItem
              type={student.displaySettings}
              planSubItem={state.planSubItems[state.subPageNumber]}
              index={state.subPageNumber}
              textSize={state.student.textSize}
              isUpperCase={state.student.isUpperCase}
              planItem={state.planItem}
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

  return state.planSubItems?.length ? renderPlan() : renderLoader();
  
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
