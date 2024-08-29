import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { StackHeaderProps } from '@react-navigation/stack';

import { Route } from '../navigation';
import { dimensions, getElevation, headerHeight, palette, typography } from '../styles';
import { IconButton } from './IconButton';
import { StyledText } from './StyledText';
import { Button, Icon, ModalTrigger, ModeSwitchButton } from '../components'
import { useRootNavigatorContext } from '../contexts/RootNavigatorContext';
import { useCurrentStudentContext } from '../contexts/CurrentStudentContext';
import { i18n } from '../locale';
import { createTutorialWithSamplePlans } from '../services/DatabaseService';

interface Props extends StackHeaderProps {}

const DASHBOARD = 'Dashboard';

export const Header: React.FC<Props> = ({...props}) => {
  const { editionMode, loading } = useRootNavigatorContext();
  const { currentStudent } = useCurrentStudentContext();
  const navigation = useRef(props.navigation);

  const [hideModal, setHideModal] = useState(false);
  const [addingSampleStudent, setAddingSampleStudent] = useState(false);

  const getTitle = () => {
    const { route } = props;
    if (route.name === Route.ImageLibrary) { return i18n.t('imageGallery:title'); }
    if (route.name == Route.RecordingLibrary) { return i18n.t('recGallery:title'); }
    if (currentStudent) { return i18n.t('header:activeStudent') + ' / ' + currentStudent.name; }
    return '';
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

  const showInfo = () => {
    return (
      <View style={styles.infoBoxContainer}>
        <Text style={{fontSize: 15, color: palette.textBody}}>
          {i18n.t('planList:helpDescription')}
        </Text>
        <View style={styles.infoBoxContainerRow}>
          <Icon name='book-open-page-variant' type='material-community'></Icon>
          <Text style={{fontSize: 15, color: palette.textBody}}>{i18n.t('planList:helpDescriptionFunctions')}</Text>
        </View>
        <View style={styles.infoBoxContainerRow}>
          <Icon name='notebook-edit' type='material-community'></Icon>
          <Text style={{fontSize: 15, color: palette.textBody}}>{i18n.t('planList:helpDescriptionPlans')}</Text>
        </View>
        <View style={styles.infoBoxContainerRow}>
          <Icon name='human-greeting-variant' type='material-community'></Icon>
          <Text style={{fontSize: 15, color: palette.textBody}}>{i18n.t('planList:helpDescriptionGuide')}</Text>
        </View>
        <View style={styles.infoBoxContainerRow}>
        <Button
            title={i18n.t('planList:addSampleStudent')}
            icon={{
              name: 'add',
              type: 'material',
              color: palette.textWhite,
              size: 16,
            }}
            buttonStyle={{marginTop: dimensions.spacingSmall}}
            titleStyle={{fontSize: 14}}
            isUppercase
            onPress={addSampleStudent}
          />
          {addingSampleStudent && <ActivityIndicator size='small' color='#262a40' />}
        </View>
      </View>
    );
  };

  const addSampleStudent = () => {
    if (!addingSampleStudent) {
      setAddingSampleStudent(true);
      createTutorialWithSamplePlans().then(() => {
        setHideModal(true);
        navigateToStudentsList();
        setAddingSampleStudent(false);
        setHideModal(false);
      })
    }
  }

  const renderButtons = () => {
    if (isDashboard() && editionMode) {
      return (
        <>
          <IconButton
            name='photo-library'
            type='material'
            size={24}
            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
            color={palette.textWhite}
            containerStyle={styles.iconContainer}
            onPress={() => {navigation.current.navigate(Route.ImageLibrary)}}/>
          <IconButton
            name='library-music'
            type='material'
            size={24}
            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
            color={palette.textWhite}
            containerStyle={styles.iconContainer}
            onPress={() => {navigation.current.navigate(Route.RecordingLibrary)}}/>
          <IconButton
            name='person'
            type='material'
            size={24}
            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
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
              hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
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
          hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
          color={palette.textWhite}
          containerStyle={styles.iconContainer}
        />
      }
      {!loading && (
      <>
        <StyledText style={styles.headerText}>{getTitle() as string}</StyledText>
        {renderButtons()}
        {isDashboard() && currentStudent && <ModeSwitchButton navigation={navigation.current}/>}
        {isDashboard() && editionMode &&
          
        <ModalTrigger
          title={i18n.t('planList:help')}
          modalContent={
            showInfo()
          }
          hide={hideModal}
        >
          <IconButton
            name='help'
            type='material'
            color={palette.textWhite}
            size={24}
            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
            containerStyle={styles.iconContainer}
            disabled
          />
        </ModalTrigger>
        } 
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
  infoBoxContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: dimensions.spacingMedium,
    padding: dimensions.spacingSmall
  },
  infoBoxContainerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: dimensions.spacingSmall,
    marginTop: dimensions.spacingSmall,
  }
});
