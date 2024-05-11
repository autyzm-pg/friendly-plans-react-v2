import React, { FC, useState, useEffect, useRef } from 'react';
import {Alert, SafeAreaView, StyleProp, StyleSheet, ToastAndroid, View, ViewStyle} from 'react-native';

import { Button, Card, IconButton, ModalTrigger, TextInput } from '../../components';
import { FormikProps } from 'formik';
import { i18n } from '../../locale';
import { PlanItem } from '../../models';
import { Text } from 'react-native-elements';
import { dimensions, palette, typography } from '../../styles';
import { ImagePicker } from './imagePicker/ImagePicker';
import { PlanItemFormData } from './PlanItemForm';
import { TimeSlider } from './TimeSlider';
import { VoicePicker } from './voicePicker/VoicePicker';
import { NavigationProp } from '@react-navigation/native';

interface Props {
  planItem: PlanItem;
  formikProps: FormikProps<PlanItemFormData>;
  style?: StyleProp<ViewStyle>;
  navigation: NavigationProp<any>;
  taskName: string | null;
  onTaskNameForChildChanged: (name: string) => void;
}

interface State {
  selectedTime: number;
}

export const Interaction: FC<Props> = ({navigation, planItem, formikProps, style, taskName, onTaskNameForChildChanged}) => {
  const [state, setState] = useState<State>({
    selectedTime: formikProps.initialValues.time
  })

  const taskSaved = useRef(false);
  
  const setScreenTitle = (title: string) => {
    navigation.setOptions({
      title: title,
    });
  };

  useEffect(() => {
    setScreenTitle(i18n.t('planItemActivity:viewTitleTask'));
  }, []);

  useEffect(() => {
    if (taskName != null)
      formikProps.setFieldValue('nameForChild', taskName);
  }, [taskName])

  const timeInfo = () => {
    const hours = Math.floor(state.selectedTime / 3600);
    const minutes = Math.floor((state.selectedTime - hours*3600) / 60);
    const seconds = state.selectedTime - minutes*60 - hours*3600;

    return (hours + minutes + seconds) > 0 ? (hours + ':' + minutes + ':' + seconds) : 'none';
  };

  const handleConfirmTimer = (time: number) => {
    formikProps.setFieldValue('time', time);
    setState({ selectedTime: time });
  };

  const showInfo = () => {
    return (
        <View style={styles.imageActionContainer}>
          <Text style={{fontSize: 15, color: palette.textBody}}>{i18n.t('planItemActivity:infoBoxNameForChild')}</Text>
        </View>
    );
  };

  const saveNewTask = async () => {
    taskSaved.current = true;
    formikProps.submitForm();
    ToastAndroid.show(i18n.t('planItemActivity:savedMessage'), 2.5);
  }

  const taskNameForChildChanged = (name: string) => {
    formikProps.setFieldValue('nameForChild', name);
    onTaskNameForChildChanged(name)
  }

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        if (!taskSaved.current) {
          // Prevent default behavior of leaving the screen
          e.preventDefault();

          // Prompt the user before leaving the screen
          Alert.alert(
            i18n.t('planItemActivity:alertMessageSaveQuestionTitle'),
            i18n.t('planItemActivity:alertMessageSaveQuestion'),
            [
              { 
                text: i18n.t('planItemActivity:alertMessageSaveQuestionDiscard'), 
                style: 'destructive', 
                onPress: () => navigation.dispatch(e.data.action) },
              {
                text: i18n.t('planItemActivity:alertMessageSaveQuestionSave'),
                style: 'default',
                onPress: saveNewTask
              },
            ],
            {
              cancelable: true,
              onDismiss: () => {}
            },
          );
        }
      }),
    [navigation])

  return (
      <SafeAreaView style={style}>
        <Card style={[styles.container]}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
            <VoicePicker planItem={planItem} formikProps={formikProps} navigation={navigation}
                          isComplexTask={false} selected={{key: -2, voicePath: '', lector: false}}/>

            <ModalTrigger
                title={i18n.t('interaction:setTimer')}
                modalContent={
                  <TimeSlider min={[0, 0, 0]} max={[2, 60, 60]} onConfirm={handleConfirmTimer}
                              savedTime={state.selectedTime}/>
                }
            >
              <IconButton
                  name={timeInfo() !== 'none' ? 'timer' : 'alarm-off'}
                  type="material"
                  label={timeInfo() === 'none' ? i18n.t('planItemActivity:timerButton') : timeInfo()}
                  containerStyle={styles.iconButtonContainer}
                  size={40}
                  color={palette.primaryVariant}
                  disabled
              />
            </ModalTrigger>
          </View>


          <View style={{flexDirection: 'column', alignItems: 'center', marginBottom: 20, paddingBottom: 16, height: '100%', width: '100%'}}>
            <ImagePicker planItem={planItem} formikProps={formikProps}
                          isComplexTask={false} selected={{key: -2, image: ''}} navigation={navigation}/>

            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TextInput
                  style={styles.imageInputTextContainer}
                  textStyle={styles.imageInputText}
                  placeholder={i18n.t('planItemActivity:taskNameForChild')}
                  value={formikProps.values.nameForChild}
                  onChangeText={taskNameForChildChanged}
              />

              <ModalTrigger
                  title={i18n.t('planItemActivity:infoBox')}
                  modalContent={
                    showInfo()
                  }
              >
                <IconButton containerStyle={{marginTop: 15, marginLeft: 10}} name={'information-circle'}
                            type={'ionicon'}
                            size={40} disabled color={palette.informationIcon}/>
              </ModalTrigger>
            </View>
            <Button
              title={i18n.t('planItemActivity:saveInteractionButton')}
              icon={{
                name: 'check',
                type: 'material',
                color: palette.textWhite,
                size: 22,
              }}
              isUppercase
              onPress={saveNewTask}
            />
          </View>

        </Card>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imageActionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: dimensions.spacingLarge,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: dimensions.spacingSmall,
    paddingBottom: dimensions.spacingHuge,
    height: '95%',
  },
  iconButtonContainer: {
    backgroundColor: palette.backgroundAdditional,
    paddingVertical: 4,
    paddingHorizontal: dimensions.spacingSmall,
    borderRadius: 8,
  },
  imageInputTextContainer: {
    marginTop: 20,
    marginBottom: 35,
    width: 300,
  },
  imageInputText: {
    ...typography.taskInput,
    textAlign: 'center',
  },
  timerButton: {
    position: 'absolute',
    right: dimensions.spacingBig,
    top: dimensions.spacingBig,
  },
});

// function useEffect(arg0: () => void, arg1: never[]) {
//   throw new Error('Function not implemented.');
// }