import React, {FC, useEffect, useState} from 'react';
import {Alert, SafeAreaView, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';

import {Button, Card, IconButton, ModalTrigger, TextInput} from '../../components';
import {FormikProps} from 'formik';
import {i18n} from '../../locale';
import {PlanItem} from '../../models';
import {Text} from 'react-native-elements';
import {dimensions, palette, typography} from '../../styles';
import {ImagePicker} from './imagePicker/ImagePicker';
import {PlanItemFormData} from './PlanItemForm';
import {TimeSlider} from './TimeSlider';
import {VoicePicker} from './voicePicker/VoicePicker';
import { NavigationProp } from '@react-navigation/native';

interface Props {
  planItem: PlanItem;
  formikProps: FormikProps<PlanItemFormData>;
  style?: StyleProp<ViewStyle>;
  navigation: NavigationProp<any>;
}

interface State {
  selectedTime: number;
}

export const SimpleTask: FC<Props> = ({navigation, planItem, formikProps, style}) => {
  const [state, setState] = useState<State>({
    selectedTime: formikProps.initialValues.time
  });

  const setScreenTitle = (title: string) => {
    navigation.setOptions({
      title: title,
    });
    };
  
  useEffect(() => {
  setScreenTitle(i18n.t('planItemActivity:viewTitleTask'));
  return () => {
    componentWillUnmount();
  }
  }, []);

  const timeInfo = () => {
    const hours = Math.floor(state.selectedTime / 3600);
    const minutes = Math.floor((state.selectedTime - hours * 3600) / 60);
    const seconds = state.selectedTime - minutes * 60 - hours * 3600;

    return (hours + minutes + seconds) > 0 ? (hours + ':' + minutes + ':' + seconds) : 'none';
  };


  const handleConfirmTimer = (time: number) => {
    formikProps.setFieldValue('time', time);
    setState({selectedTime: time});
  };

  const showInfo = () => {
    return (
      <View style={styles.imageActionContainer}>
        <Text style={{fontSize: 15, color: palette.textBody}}>{i18n.t('planItemActivity:infoBoxNameForChild')}</Text>
      </View>
    );
  };

  const componentWillUnmount = () => {
    Alert.alert(
      i18n.t('planItemActivity:alertTitle'),
      planItem ? i18n.t('planItemActivity:alertMessageUpdate') : i18n.t('planItemActivity:alertMessageCreate')
    );
  }   

  const saveNewTask = async () => {
    formikProps.submitForm()
  }

  return (
    <SafeAreaView style={style}>
      <Card style={[styles.container]}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
          <VoicePicker planItem={planItem} formikProps={formikProps}
                  isComplexTask={false} selected={{key: -2, voicePath: '', lector: false}}/>

          <ModalTrigger
            title={i18n.t('simpleTask:setTimer')}
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

        <View style={{flexDirection: 'column', alignItems: 'center', marginBottom: 20, height: '100%', width: '100%'}}>
          <ImagePicker planItem={planItem} formikProps={formikProps}
                  isComplexTask={false} selected={{key: -2, image: ''}} navigation={navigation}/>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TextInput
              style={styles.imageInputTextContainer}
              textStyle={styles.imageInputText}
              placeholder={i18n.t('planItemActivity:taskNameForChild')}
              value={formikProps.values.nameForChild}
              onChangeText={formikProps.handleChange('nameForChild')}
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
            title={i18n.t('planItemActivity:saveSimpleTaskButton')}
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
