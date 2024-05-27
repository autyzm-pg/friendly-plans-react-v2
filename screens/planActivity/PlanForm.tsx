import { Formik, FormikHelpers } from 'formik';
import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PlayButton, Emoji, Icon, ModalTrigger, TextInput } from '../../components';
import { i18n } from '../../locale';
import { Plan, Student } from '../../models';
import { dimensions, palette } from '../../styles';
import { DEFAULT_EMOJI } from '../../assets/emojis';
import { IconSelectModal } from './IconSelectModal';
import { NavigationProp } from '@react-navigation/native';
import { useCurrentStudentContext } from '../../contexts/CurrentStudentContext';
import { MultiButton } from './MultiButton';

export interface PlanFormData {
  planInput: string;
  emoji: string;
};

export interface PlanFormError {
  planInput?: string;
};

interface Props {
  onSubmit: (values: PlanFormData, actions: FormikHelpers<PlanFormData>) => void | Promise<any>;
  onValidate: (values: PlanFormData) => void | Promise<any>;
  plan?: Plan;
  playDisabled?: boolean;
  numberPlan?: number;
  student: Student;
  navigation: NavigationProp<any>;
  deleteMultiple: () => void;
  shuffleMultiple?: () => void;
  changeStateOfMultiple?: () => void;
  unSelectMultiple?: () => void;
};

export const PlanForm: FC<Props> = ({
  plan,
  onSubmit,
  onValidate,
  playDisabled = false,
  navigation,
  deleteMultiple,
  shuffleMultiple,
  changeStateOfMultiple,
  unSelectMultiple,
}) => {
  
  const {currentStudent} = useCurrentStudentContext();
  
  const initialValues: PlanFormData = {
    planInput: plan ? plan.name : '',
    emoji: plan ? plan.emoji : DEFAULT_EMOJI,
  };

  const renderFormControls = ({ values, handleChange, handleSubmit, errors }: any) => {
    const updateEmoji = async (emoji: string) => {
      handleChange('emoji')(emoji);
      handleSubmit();
    };

  const renderMultiButtons = () => {
    return ( // TODO
      <View style={[styles.buttonContainer, {marginRight: dimensions.spacingSmall}]}>
        <MultiButton onPress={deleteMultiple} title={i18n.t('planActivity:deleteTasks')} 
                     buttonName='trash' buttonType='font-awesome' disabled={true}/>
        <MultiButton onPress={shuffleMultiple} title={i18n.t('planActivity:shuffleTasks')}  
                     buttonName='shuffle' buttonType='material-community-icons' disabled={true}/>
        <MultiButton onPress={changeStateOfMultiple} title={i18n.t('planActivity:changeState')}
                     buttonName='swap-horiz' buttonType='material-community-icons' disabled={true}/>
        <MultiButton onPress={unSelectMultiple} title={i18n.t('planActivity:selectTasks')}
                     buttonName='check-square' buttonType='feather' disabled={false}/>
      </View>
    );
  };

    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          {plan ? (
            <ModalTrigger title={'Wybierz ikonę'} modalContent={<IconSelectModal onEmojiSelect={updateEmoji} />}>
              <Emoji symbol={values.emoji} />
            </ModalTrigger>
          ) : (
            <Icon name="emoticon" size={24} color={palette.textInputPlaceholder} />
          )}
          <TextInput
            style={styles.textInput}
            placeholder={i18n.t('planActivity:planNamePlaceholder')}
            value={values.planInput}
            onChangeText={handleChange('planInput')}
            onBlur={handleSubmit}
            autoFocus={!plan?.name}
          />
          <Text style={styles.errorMessage}>{errors.planInput}</Text>
        </View>
        <View style={styles.buttonContainer}>
          {renderMultiButtons()}
          <PlayButton plan={plan} disabled={!plan || playDisabled} size={36} navigation={navigation} student={currentStudent}/>
        </View>
      </View>
    );
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={onValidate}
    >
      {renderFormControls}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: dimensions.spacingLarge,
    paddingRight: dimensions.spacingBig,
    borderBottomColor: palette.backgroundAdditional,
    borderBottomWidth: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '40%',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    marginLeft: dimensions.spacingSmall,
  },
  errorMessage: {
    color: palette.error,
    marginLeft: dimensions.spacingSmall,
  },
});
