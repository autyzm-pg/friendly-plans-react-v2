import { Formik, FormikHelpers } from 'formik';
import React, { FC, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { PlayButton, Emoji, Icon, ModalTrigger, TextInput, CheckboxInput } from '../../components';
import { i18n } from '../../locale';
import { dimensions, palette } from '../../styles';
import { DEFAULT_EMOJI } from '../../assets/emojis';
import { IconSelectModal } from './IconSelectModal';
import { NavigationProp } from '@react-navigation/native';
import { useCurrentStudentContext } from '../../contexts/CurrentStudentContext';
import { MultiButton } from './MultiButton';
import { usePlanActivityContext, PlanItemState } from '../../contexts/PlanActivityContext';
import { PlanItem, PlanItemType, PlanSubItem } from '../../models';

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
  navigation: NavigationProp<any>;
  updatePlanItemsOrder: (items: PlanItemState[]) => Promise<void>;
};

export const PlanForm: FC<Props> = ({
  onSubmit,
  onValidate,
  navigation,
  updatePlanItemsOrder
}) => {
  
  const {currentStudent} = useCurrentStudentContext();
  const {plan, planItems, setPlanItems} = usePlanActivityContext();
  const [shuffleNoBreaks, setShuffleNoBreaks] = useState<boolean>(true);

  const initialValues: PlanFormData = {
    planInput: plan ? plan.name : '',
    emoji: plan ? plan.emoji : DEFAULT_EMOJI,
  };

  const deleteMultiple = async() => {
    Alert.alert(i18n.t('planActivity:deleteTaskHeader'), i18n.t('planActivity:deleteTaskInfo'), [
      { text: i18n.t('common:cancel') },
      {
        text: i18n.t('common:confirm'),
        onPress: () => {
          const items: PlanItemState[] = [];
          planItems.forEach(async(state: PlanItemState) => {
            if (!state.checked) { 
              items.push(state);
              return;
            }
            await PlanItem.deletePlanItem(state.planItem);
          });
          setPlanItems(items);
        },
      },
    ]);
  };

  const shuffle = () => {
    let checkedItems = planItems.filter(item => item.checked);
    if (shuffleNoBreaks) { checkedItems = checkedItems.filter(item => item.planItem.type !== PlanItemType.Break); }
    for (let i = checkedItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [checkedItems[i], checkedItems[j]] = [checkedItems[j], checkedItems[i]];
    }
    const newPlanItems = planItems.map(item => {
      if (!item.checked || (shuffleNoBreaks && item.planItem.type === PlanItemType.Break)) { return item; }
      const checkedItem = checkedItems.shift();
      return checkedItem;
    });
    //@ts-ignore
    setPlanItems(newPlanItems);
    //@ts-ignore
    updatePlanItemsOrder(newPlanItems);
  };

  const changeState = async(item: PlanItem) => {
    await PlanItem.updatePlanItem(item);
    if (item.type === PlanItemType.ComplexTask) {
      await PlanSubItem.getPlanSubItems(item).then(subItems => {
        subItems.forEach(async(subItem) => {
          subItem.completed = item.completed;
          await PlanSubItem.updatePlanSubItem(subItem);
        });
      });
    };
  };

  const changeStateOfMultiple = async() => {
    const checked = planItems.filter((state) => state.checked);
    const completed = checked.filter((state) => state.planItem.completed).length;
    let updated: PlanItemState[] = [];
    if (completed == checked.length) {
      updated = planItems.map((state) => {
        if (!state.checked) { return state };
        return { ...state, planItem: { ...state.planItem, completed: false } };
      });
    } else {
      updated = planItems.map((state) => {
        if (!state.checked) { return state };
        return { ...state, planItem: { ...state.planItem, completed: true }};
      });
    }
    updated.forEach(async(item) => { 
      if (!item.checked) { return; }
      await changeState(item.planItem); 
    });
    setPlanItems(updated);
  };

  const renderMultiButtons = () => {
    const checked = planItems.filter((item) => { return item.checked; }).length;
    return (
      <View style={[styles.buttonContainer, {marginRight: dimensions.spacingSmall}]}>
        <MultiButton onPress={deleteMultiple} title={i18n.t('planActivity:deleteTasks')} 
                    buttonName='trash' buttonType='font-awesome' disabled={!checked}/>
        <MultiButton onPress={changeStateOfMultiple} title={i18n.t('planActivity:changeState')}
                    buttonName='swap-horiz' buttonType='material-community-icons' disabled={!checked}/>
        <MultiButton onPress={shuffle} title={i18n.t('planActivity:shuffleTasks')}  
                    buttonName='shuffle' buttonType='material-community-icons' disabled={checked < 2}/>
        <CheckboxInput title={i18n.t('planActivity:withoutBreaks')} 
                       checked={shuffleNoBreaks} 
                       onPress={setShuffleNoBreaks} 
                       hitSlope={{ top: 0, bottom: 0, left: 0, right: 0 }}
                       />
      </View>
    );
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
            <ModalTrigger title={'Wybierz ikonę'} modalContent={<IconSelectModal onEmojiSelect={updateEmoji}/>}>
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
          <PlayButton plan={plan} disabled={!plan || !planItems} size={36} navigation={navigation} student={currentStudent}/>
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
