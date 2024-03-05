import { Formik, FormikHelpers } from 'formik';
import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PlayButton, Emoji, Icon, ModalTrigger, TextInput } from '../../components';
import { i18n } from '../../locale';
import { Plan, Student } from '../../models';
import { dimensions, palette } from '../../styles';
import { DEFAULT_EMOJI } from '../../assets/emojis';
import { IconSelectModal } from './IconSelectModal';
import { ShuffleButton } from './ShuffleButton';
import { NavigationProp } from '@react-navigation/native';

export interface PlanFormData {
  planInput: string;
  emoji: string;
}

export interface PlanFormError {
  planInput?: string;
}

interface Props {
  onSubmit: (values: PlanFormData, actions: FormikHelpers<PlanFormData>) => void | Promise<any>;
  onValidate: (values: PlanFormData) => void | Promise<any>;
  plan?: Plan;
  shuffleDisabled?: boolean;
  playDisabled?: boolean;
  numberPlan?: number;
  onShuffle?: () => void;
  student: Student;
  navigation: NavigationProp<any>;
}

export const PlanForm: FC<Props> = ({
  plan,
  numberPlan,
  onSubmit,
  onValidate,
  shuffleDisabled = false,
  playDisabled = false,
  onShuffle,
  student,
  navigation
}) => {
  const initialValues: PlanFormData = {
    planInput: plan ? plan.name : `${i18n.t('planActivity:newPlan')}${numberPlan}`,
    emoji: plan ? DEFAULT_EMOJI : DEFAULT_EMOJI,
  };

  const renderFormControls = ({ values, handleChange, handleSubmit, errors }: any) => {
    const updateEmoji = async (emoji: string) => {
      handleChange('emoji')(emoji);
      handleSubmit();
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
          />
          <Text style={styles.errorMessage}>{errors.planInput}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <ShuffleButton disabled={shuffleDisabled} onPress={onShuffle} />
          <PlayButton plan={plan} disabled={!plan || playDisabled} size={36} navigation={navigation} student={student}/>
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
