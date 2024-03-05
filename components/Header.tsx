import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { StackHeaderProps } from '@react-navigation/stack';

import { Route } from '../navigation';
import { dimensions, getElevation, headerHeight, palette, typography } from '../styles';
import { IconButton } from './IconButton';
import { StyledText } from './StyledText';
import { DrawerActions, NavigationProp, useNavigation } from '@react-navigation/native';
import { Student } from '../models';

interface Props extends StackHeaderProps {
  student: Student;
}

const DASHBOARD = 'Dashboard';

export const Header: React.FC<Props> = ({student, ...props}) => {
  const navigation = props.navigation
  const getTitle = () => {
    const { route, options } = props;

    const headerTitle = (title: string) => {
      const studentPrefix = student ? `${student.name} / ` : '';
      return `${studentPrefix}${title}`;
    };

    if (options.headerTitle && options.headerTitle !== 'function') {
      return options.headerTitle;
    }

    return headerTitle(options.title || route.name);
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
    const { route } = props;
    const routeName = route.name

    return routeName === DASHBOARD;
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
