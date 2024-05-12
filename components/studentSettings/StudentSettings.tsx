import React, { FC, useEffect, useState } from 'react';
import {StyleSheet, View} from 'react-native';

import {i18n} from '../../locale';
import {Student, StudentData, StudentDisplayOption, StudentTextSizeOption} from '../../models';
import {dimensions, palette, typography} from '../../styles';

import {Separator} from '../Separator';
import {StudentSettingsButton} from '../StudentSettingsButton';
import {StyledText} from '../StyledText';
import {TextInput} from '../TextInput';
import {AlarmSoundSetting} from './AlarmSoundSetting';
import {DisplaySetting} from './DisplaySetting';
import {PlanDisplayPreview} from './PlanDisplayPreview';
import {SlideCardSetting} from './SlideCardSetting';
import {TextCaseSetting} from './TextCaseSetting';
import {TextSizeSetting} from './TextSizeSetting';
import { useCurrentStudentContext } from '../../contexts/CurrentStudentContext';

interface Props {
  student: StudentData;
  onStudentCreate?: (data: StudentData) => any;
  onStudentRemove?: () => void;
  onStudentUpdate?: (data: StudentData) => any;
}


export const StudentSettings: FC<Props> = ({student, onStudentCreate, onStudentRemove, onStudentUpdate}) => {
  const [state, setState] = useState<StudentData>({
    name: student.name,
    displaySettings: student.displaySettings,
    textSize: student.textSize,
    isUpperCase: student.isUpperCase,
    isSwipeBlocked: student.isSwipeBlocked,
    timer: student.timer
  });
  
  const {currentStudent} = useCurrentStudentContext();

  const canCreate = () => {
    return !!state.name;
  }

  const handleTimerChange = (timer: string) => {
    setState(prevState => ({ ...prevState, timer: timer }));
  }

  const handleNameChange = (name: string) => {
    setState(prevState => ({ ...prevState, name: name }));
  }

  const onDisplaySettingsChange = (displaySettings: StudentDisplayOption) => {
    setState(prevState => ({ ...prevState, displaySettings }));
  }

  const onTextSizeChange = (textSize: StudentTextSizeOption) => {
    setState(prevState => ({ ...prevState, textSize }));
  }

  const onTextCaseChange = (isUpperCase: boolean) => {
    setState(prevState => ({ ...prevState, isUpperCase }));
  }

  const onSwipeBlockedChange = (isSwipeBlocked: boolean) => {
    setState(prevState => ({ ...prevState, isSwipeBlocked }));
  }

  // useEffect(() => {
  //   if (state && currentStudent && !Student.equals(state, currentStudent))
  //     handleStudentUpdate();
  // }, [state]);

  const handleStudentCreate = () => onStudentCreate && onStudentCreate(state);

  const handleStudentUpdate = () => {
    if(onStudentUpdate && (state && currentStudent && !Student.equals(state, currentStudent))) {
      onStudentUpdate(state);
    }
  }

  return (
    <>
      <StyledText style={styles.label}>{i18n.t('studentSettings:studentName')}</StyledText>
      <TextInput
        style={styles.textInput}
        placeholder={i18n.t('studentSettings:studentNamePlaceholder')}
        value={state.name}
        onChangeText={handleNameChange}
      />
      <Separator extraWide/>
      <StyledText
        style={[styles.label, styles.taskViewLabel]}>{i18n.t('studentSettings:taskView')}</StyledText>
      <PlanDisplayPreview displaySettings={state.displaySettings} textSize={state.textSize} isUpperCase={state.isUpperCase}/>
      <DisplaySetting value={state.displaySettings} onValueChange={onDisplaySettingsChange}/>
      <TextSizeSetting value={state.textSize} onValueChange={onTextSizeChange}/>
      <TextCaseSetting value={state.isUpperCase} onValueChange={onTextCaseChange}/>
      <SlideCardSetting value={state.isSwipeBlocked} onValueChange={onSwipeBlockedChange}/>
      <Separator extraWide/>
      <StyledText
        style={[styles.label, styles.taskViewLabel]}>{i18n.t('studentSettings:soundSettings')}</StyledText>
      <AlarmSoundSetting sound={state.timer} onValueChange={handleTimerChange}/>
      <Separator extraWide/>

      {!!onStudentCreate && (
        <View style={styles.iconButtonContainer}>
          <StudentSettingsButton
            name="pluscircleo"
            type="antdesign"
            label={i18n.t('studentSettings:createStudent')}
            containerStyle={{backgroundColor: palette.primaryVariant}}
            size={24}
            disabled={!canCreate}
            onPress={handleStudentCreate}
          />
        </View>
      )}
      {
        !!onStudentUpdate && (
          <View style={styles.iconButtonContainer}>
            <StudentSettingsButton
              name="check"
              type="antdesign"
              label={i18n.t('studentSettings:editStudent')}
              containerStyle={{backgroundColor: palette.primaryVariant}}
              size={24}
              disabled={false}
              onPress={handleStudentUpdate}
            />
          </View>
        )
      }
      {!!onStudentRemove && (
        <View style={styles.iconButtonContainer}>
          <StudentSettingsButton
            name="delete"
            type="material"
            label={i18n.t('studentSettings:removeStudent')}
            containerStyle={{backgroundColor: palette.deleteStudentButton}}
            size={24}
            disabled={false}
            onPress={onStudentRemove}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.overline,
    color: palette.textSettings,
  },
  taskViewLabel: {
    marginVertical: dimensions.spacingSmall,
  },
  textInput: {
    marginTop: dimensions.spacingSmall,
    marginBottom: dimensions.spacingBig,
  },
  iconButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
});
