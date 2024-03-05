import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import { Route } from '../navigation';
import { dimensions, getElevation, headerHeight, palette, typography } from '../styles';
import { IconButton } from './IconButton';
import { StyledText } from './StyledText';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { defaults } from "../mocks/defaults"

interface Props {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}

const DASHBOARD = 'Dashboard';

export const Header: FC<Props> =({navigation, route}) => {

  const student = route.params?.student ? route.params?.student : defaults.student; // TODO: How to pass student?

  const getTitle = () => {

    const containsStudentName = (route_name: Route) => {
      return [Route.Dashboard].includes(route_name);
    }

    const isOverlaying = () => {
      return [Route.StudentSettings].includes(route.name as Route);
    }

    const headerTitle = (title: string) => {
      const studentPrefix = student ? `${student.name} / ` : '';
      return `${studentPrefix}${title}`;
    };

    if (containsStudentName(route.name as Route)) {
      return headerTitle(route.name);
    }

    if(isOverlaying()) {
      const routes = navigation.getState()?.routes;
      const prev_route = routes[routes.length-2];

      if (containsStudentName(prev_route.name as Route)) {
        return headerTitle(prev_route.name);
      }

      return prev_route.name
    }

    return route.name;
  }

  const goBack = () => navigation.goBack();

  const navigateToStudentsList = () => {
    navigation.navigate(Route.StudentsList);
  };

  const navigateToStudentSettings = () => {
    navigation.navigate(Route.StudentSettings, {
      student: student,
    });
  };

  const isDashboard = () => {
    return route.name === DASHBOARD;
  }

  const renderButtons = () => {
    return isDashboard() ? (
      <>
        {student && (
          <IconButton
            name="settings"
            type="material"
            color={palette.textWhite}
            size={24}
            containerStyle={styles.iconContainer}
            onPress={navigateToStudentSettings}
          />
        )}
        <IconButton
          name="people"
          type="material"
          size={24}
          color={palette.textWhite}
          containerStyle={styles.iconContainer}
          onPress={navigateToStudentsList}
        />
      </>
    ) : null;
  }

  return (
    <View style={styles.container}>
      {!isDashboard() ?
          <IconButton
          name={'arrow-back'}
          type="material"
          onPress={goBack}
          size={24}
          color={palette.textWhite}
          containerStyle={styles.iconContainer}
        />
        :
        <></>
      }
      <StyledText style={styles.headerText}>{getTitle() as string}</StyledText>
      {renderButtons()}
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
    margin: dimensions.spacingSmall,
  },
  headerText: {
    marginStart: 8,
    flex: 1,
    ...typography.title,
    color: palette.textWhite,
  },
});
