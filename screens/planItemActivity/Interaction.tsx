import React, { useState } from 'react';
import {Alert, SafeAreaView, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';

import { Card, IconButton, ModalTrigger, TextInput } from '../../components';
import { FormikProps } from 'formik';
import { i18n } from '../../locale';
import { PlanElement, PlanItem, Student } from '../../models';
import {Text} from 'react-native-elements';
import { dimensions, palette, typography } from '../../styles';
import { ImagePicker } from './ImagePicker';
import { PlanItemFormData } from './PlanItemForm';
import { TimeSlider } from './TimeSlider';
import {VoicePicker} from './voicePicker/VoicePicker';

interface Props {
  planItem: PlanItem;
  formikProps: FormikProps<PlanItemFormData>;
  style?: StyleProp<ViewStyle>;
}

interface State {
  selectedTime: number;
}

export class Interaction extends React.PureComponent<Props, State> {
  static navigationOptions = {
    title: i18n.t('planItemActivity:viewTitleTask'),
  };
  state: Readonly<State> = {
    selectedTime: this.props.formikProps.initialValues.time,
  };

  timeInfo = () => {
    const hours = Math.floor(this.state.selectedTime / 3600);
    const minutes = Math.floor((this.state.selectedTime - hours*3600) / 60);
    const seconds = this.state.selectedTime - minutes*60 - hours*3600;

    return (hours + minutes + seconds) > 0 ? (hours + ':' + minutes + ':' + seconds) : 'none';
  };

  handleConfirmTimer = (time: number) => {
    this.props.formikProps.setFieldValue('time', time);
    this.setState({ selectedTime: time });
  };

  showInfo = () => {
    return (
        <View style={styles.imageActionContainer}>
          <Text style={{fontSize: 15, color: palette.textBody}}>{i18n.t('planItemActivity:infoBoxNameForChild')}</Text>
        </View>
    );
  };

  componentWillUnmount() {
    this.props.formikProps.submitForm();
    Alert.alert(
        i18n.t('planItemActivity:alertTitle'),
        this.props.planItem ? i18n.t('planItemActivity:alertMessageUpdate') : i18n.t('planItemActivity:alertMessageCreate')
    );
  }

  render() {
    const {values, handleChange} = this.props.formikProps;
    const timeInfo = this.timeInfo;

    return (
        <SafeAreaView style={this.props.style}>
          <Card style={[styles.container]}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
              <VoicePicker planItem={this.props.planItem} formikProps={this.props.formikProps}
                           isComplexTask={false} selected={{key: -2, voicePath: '', lector: false}}/>

              <ModalTrigger
                  title={i18n.t('interaction:setTimer')}
                  modalContent={
                    <TimeSlider min={[0, 0, 0]} max={[2, 60, 60]} onConfirm={this.handleConfirmTimer}
                                savedTime={this.state.selectedTime}/>
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
              <ImagePicker planItem={this.props.planItem} formikProps={this.props.formikProps}
                           isComplexTask={false} selected={{key: -2, image: ''}}/>

              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TextInput
                    style={styles.imageInputTextContainer}
                    textStyle={styles.imageInputText}
                    placeholder={i18n.t('planItemActivity:taskNameForChild')}
                    value={values.nameForChild}
                    onChangeText={handleChange('nameForChild')}
                />

                <ModalTrigger
                    title={i18n.t('planItemActivity:infoBox')}
                    modalContent={
                      this.showInfo()
                    }
                >
                  <IconButton containerStyle={{marginTop: 15, marginLeft: 10}} name={'md-information-circle'}
                              type={'ionicon'}
                              size={40} disabled color={palette.informationIcon}/>
                </ModalTrigger>
              </View>
            </View>

          </Card>
        </SafeAreaView>
    );
  }
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
