import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { StackHeaderProps } from '@react-navigation/stack';

import { Route } from '../navigation';
import { dimensions, getElevation, headerHeight, palette, typography } from '../styles';
import { IconButton } from './IconButton';
import { StyledText } from './StyledText';
import { ModeSwitchButton } from '../components'
import { useRootNavigatorContext } from '../contexts/RootNavigatorContext';
import { useCurrentStudentContext } from '../contexts/CurrentStudentContext';
import { i18n } from '../locale';

interface Props extends StackHeaderProps {}

const DASHBOARD = 'Dashboard';

export const Header: React.FC<Props> = ({...props}) => {
  const { editionMode, loading } = useRootNavigatorContext();
  const { currentStudent } = useCurrentStudentContext();
  const navigation = useRef(props.navigation);

  const getTitle = () => {
    if (currentStudent) {
      return i18n.t('header:activeStudent') + ': ' + currentStudent.name;
    }
    return i18n.t('header:noStudentCreated');
  };

  const goBack = () => {
    const { route } = props;
    if (route.name === Route.RunPlanSlide 
      || route.name === Route.RunPlanList
      || route.name === Route.RunSubPlanSlide
    ) {
      navigation.current.navigate(Route.Dashboard);
    } else {
      navigation.current.goBack();
    }
  };

  const navigateToStudentsList = () => {
    navigation.current.navigate(Route.StudentsList);
  };

  const navigateToStudentSettings = () => {
    navigation.current.navigate(Route.StudentSettings, {
      student: currentStudent,
    });
  };

  const isDashboard = () => {
    const { route } = props;
    const routeName = route.name;
    return routeName === DASHBOARD;
  };

  const renderButtons = () => {
    if (isDashboard() && editionMode) {
      return (
        <>
          <IconButton
            name='photo-library'
            type='material'
            size={24}
            color={palette.textWhite}
            containerStyle={styles.iconContainer}
            onPress={() => {navigation.current.navigate(Route.ImageLibrary)}}/>
          <IconButton
            name='library-music'
            type='material'
            size={24}
            color={palette.textWhite}
            containerStyle={styles.iconContainer}
            onPress={() => {navigation.current.navigate(Route.RecordingLibrary)}}/>
          <IconButton
            name='people'
            type='material'
            size={24}
            color={palette.textWhite}
            containerStyle={styles.iconContainer}
            onPress={navigateToStudentsList}
          />
          {currentStudent && (
            <IconButton
              name='settings'
              type='material'
              color={palette.textWhite}
              size={24}
              containerStyle={styles.iconContainer}
              onPress={navigateToStudentSettings}
            />
          )}
        </>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {!isDashboard() &&
          <IconButton
          name={'arrow-back'}
          type='material'
          onPress={goBack}
          size={24}
          color={palette.textWhite}
          containerStyle={styles.iconContainer}
        />
      }
      {!loading && (
      <>
        <StyledText style={styles.headerText}>{getTitle() as string}</StyledText>
        {renderButtons()}
        {isDashboard() && <ModeSwitchButton navigation={navigation.current}/>}
      </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...getElevation(4),
    height: headerHeight,
    paddingHorizontal: 16,
    backgroundColor: palette.primaryVariant,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    margin: dimensions.spacingTiny,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  headerText: {
    marginStart: 8,
    flex: 1,
    ...typography.title,
    color: palette.textWhite,
  },
});
