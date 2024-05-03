import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StackHeaderProps } from '@react-navigation/stack';

import { Route } from '../navigation';
import { dimensions, getElevation, headerHeight, palette, typography } from '../styles';
import { IconButton } from './IconButton';
import { StyledText } from './StyledText';
import { ModeSwitchHeader } from '../components'
import { useRootNavigatorContext } from '../contexts/RootNavigatorContext';
import { useCurrentStudentContext } from '../contexts/CurrentStudentContext';
import { i18n } from '../locale';

interface Props extends StackHeaderProps {}

const DASHBOARD = 'Dashboard';

export const Header: React.FC<Props> = ({...props}) => {
  const { editionMode, loading } = useRootNavigatorContext();
  const { currentStudent, setCurrentStudent } = useCurrentStudentContext();
  
  const navigation = props.navigation

  const getTitle = () => {
    if (currentStudent) {
      return i18n.t('header:activeStudent') + ': ' + currentStudent.name;
    }
    return i18n.t('header:noStudentCreated')
  }

  const goBack = () => navigation.goBack();

  const navigateToStudentsList = () => {
    navigation.navigate(Route.StudentsList);
  };

  const navigateToStudentSettings = () => {
    navigation.navigate(Route.StudentSettings, {
      student: currentStudent,
    });
  };

  const isDashboard = () => {
    const { route } = props;
    const routeName = route.name

    return routeName === DASHBOARD;
  }

  const renderButtons = () => {
    return isDashboard() ? (
      <>
        {currentStudent && editionMode && (
          <IconButton
            name="settings"
            type="material"
            color={palette.textWhite}
            size={24}
            containerStyle={styles.iconContainer}
            onPress={navigateToStudentSettings}
          />
        )}
        {editionMode && <IconButton
          name="people"
          type="material"
          size={24}
          color={palette.textWhite}
          containerStyle={styles.iconContainer}
          onPress={navigateToStudentsList}
        />}
          <ModeSwitchHeader navigation={navigation}/>
      </>
    ) : null;
  }

  return (
    <View style={styles.container}>
      {!isDashboard() &&
          <IconButton
          name={'arrow-back'}
          type="material"
          onPress={goBack}
          size={24}
          color={palette.textWhite}
          containerStyle={styles.iconContainer}
        />
      }
      {!loading && <StyledText style={styles.headerText}>{getTitle() as string}</StyledText>}
      {!loading && renderButtons()}
    </View>
  );
}

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
    paddingVertical: 12,
  },
  headerText: {
    marginStart: 8,
    flex: 1,
    ...typography.title,
    color: palette.textWhite,
  },
});
