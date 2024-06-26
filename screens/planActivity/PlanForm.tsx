import { Formik, FormikHelpers } from 'formik';
import React, { FC, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { PlayButton, Emoji, Icon, ModalTrigger, TextInput, CheckboxInput, IconButton } from '../../components';
import { i18n } from '../../locale';
import { dimensions, palette } from '../../styles';
import { DEFAULT_EMOJI } from '../../assets/emojis';
import { IconSelectModal } from './IconSelectModal';
import { NavigationProp } from '@react-navigation/native';
import { useCurrentStudentContext } from '../../contexts/CurrentStudentContext';
import { MultiButton } from '../../components/MultiButton';
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
  onPlanRun: () => void
};

export const PlanForm: FC<Props> = ({
  onSubmit,
  onValidate,
  navigation,
  updatePlanItemsOrder,
  onPlanRun
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
    let checkedItems = planItems.filter(item => item.checked && !item.locked);
    //if (shuffleNoBreaks) { checkedItems = checkedItems.filter(item => item.planItem.type !== PlanItemType.Break); }
    for (let i = checkedItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [checkedItems[i], checkedItems[j]] = [checkedItems[j], checkedItems[i]];
    }
    const newPlanItems = planItems.map(item => {
      if (!item.checked  || item.locked /*|| (shuffleNoBreaks && item.planItem.type === PlanItemType.Break)*/) { return item; }
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

  const changeStateOfMultiple = async (all?: boolean) => {
    const checked = all ? planItems : planItems.filter((state) => state.checked);
    const completed = checked.filter((state) => state.planItem.completed).length;
    let updated: PlanItemState[] = [];
    if (completed == checked.length) {
      updated = planItems.map((state) => {
        if (!state.checked && !all) { return state };
        return { ...state, planItem: { ...state.planItem, completed: false } };
      });
    } else {
      updated = planItems.map((state) => {
        if (!state.checked && !all) { return state };
        return { ...state, planItem: { ...state.planItem, completed: true }};
      });
    }
    updated.forEach(async(item) => { 
      if (!item.checked && !all) { return; }
      await changeState(item.planItem); 
    });
    setPlanItems(updated);
  };

  const changeLockOfMultiple = async() => {
    const checked = planItems.filter((state) => state.checked);
    const locked = checked.filter((state) => state.locked);
    let updated = planItems.map((item) => {
      if (!item.checked) return item;
      return {...item, locked: checked.length == locked.length ? false : true}
    });
    setPlanItems(updated);
  };
  
  const showInfo = () => {
    return (
      <View style={styles.infoBoxContainer}>
        <Text style={{fontSize: 15, color: palette.textBody}}>
          {i18n.t('planActivity:infoBoxTaskButtons')}
        </Text>
        <View style={styles.infoBoxContainerRow}>
          <Icon name='trash' type='font-awesome'></Icon>
          <Text style={{fontSize: 15, color: palette.textBody}}>{i18n.t('planActivity:infoBoxTaskButtonsDelete')}</Text>
        </View>
        <View style={styles.infoBoxContainerRow}>
          <Icon name='swap-horiz' type='material-community-icons'></Icon>
          <Text style={{fontSize: 15, color: palette.textBody}}>{i18n.t('planActivity:infoBoxTaskButtonsChangeState')}</Text>
        </View>
        <View style={styles.infoBoxContainerRow}>
          <Icon name='shuffle' type='material-community-icons'></Icon>
          <Text style={{fontSize: 15, color: palette.textBody}}>{i18n.t('planActivity:infoBoxTaskButtonsRotate')}</Text>
        </View>
        <View style={styles.infoBoxContainerRow}>
          <Icon name='lock' type='font-awesome'></Icon>
          <Text style={{fontSize: 15, color: palette.textBody}}>{i18n.t('planActivity:infoBoxTaskButtonsLock')}</Text>
        </View>
      </View>
    );
  };

  const renderMultiButtons = () => {
    const checked = planItems.filter((item) => { return item.checked; }).length;
    return (
      <View style={[styles.buttonContainer, { marginRight: dimensions.spacingBig }]}>
        
        <MultiButton onPress={deleteMultiple} title={i18n.t('planActivity:deleteTasks')} 
                    buttonName='trash' buttonType='font-awesome' disabled={!checked}/>
        <MultiButton onPress={() => changeStateOfMultiple(false)} title={i18n.t('planActivity:changeState')}
                    buttonName='swap-horiz' buttonType='material-community-icons' disabled={!checked}/>
        <MultiButton onPress={shuffle} title={i18n.t('planActivity:shuffleTasks')}  
                    buttonName='shuffle' buttonType='material-community-icons' disabled={checked < 2}/>
        <MultiButton onPress={changeLockOfMultiple} title={i18n.t('planActivity:lockTasks')}  
                    buttonName='lock' buttonType='font-awesome' disabled={!checked}/>
        {/* <View style={{ marginRight: dimensions.spacingSmall }}></View> */}
        {/* <CheckboxInput title={i18n.t('planActivity:withoutBreaks')} 
                       checked={shuffleNoBreaks} 
                       onPress={setShuffleNoBreaks} 
                       hitSlope={{ top: 0, bottom: 0, left: 0, right: 0 }}
                       /> */}
        <ModalTrigger
          title={i18n.t('planItemActivity:infoBox')}
          modalContent={
            showInfo()
          }
        >
          <IconButton containerStyle={{marginLeft: 15, marginRight: 15}} name={'information-circle'}
            type={'ionicon'}
            size={34} disabled color={palette.informationIcon}/>
        </ModalTrigger>
      </View>
    );
  };

  const runPlanFromBeginning = async () => {
    await changeStateOfMultiple(true);
  }

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
            height={35}
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
          <PlayButton
            plan={plan} 
            disabled={!plan || !planItems} 
            size={36} 
            navigation={navigation} 
            student={currentStudent} 
            onPlanRun={onPlanRun}
            runPlanFromBeginning={runPlanFromBeginning}
          />
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
    height: 60,
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
  infoBoxContainer: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginTop: dimensions.spacingLarge,
  },
  infoBoxContainerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: dimensions.spacingSmall,
    marginTop: dimensions.spacingSmall,
  }
});
