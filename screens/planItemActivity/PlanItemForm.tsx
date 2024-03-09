import {StyledText, TextInput} from '../../components';
import {Formik, FormikProps} from 'formik';
import {i18n} from '../../locale';
import {PlanItem, PlanItemType, PlanSubItem} from '../../models';
import React, {FC, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {dimensions, getElevation, palette, typography} from '../../styles';
import * as Yup from 'yup';
import {Break} from './Break';
import {ComplexTask} from './ComplexTask';
import {Interaction} from './Interaction';
import {SimpleTask} from './SimpleTask';
import {NavigationProp} from '@react-navigation/native';

export interface PlanItemFormData {
  name: string;
  time: number;
  nameForChild: string;
  subItems: PlanSubItem[];
  deleteSubItems: PlanSubItem[];
  type: PlanItemType;
  imageUri: string;
  lector: boolean;
  voicePath: string;
}

interface Props {
  onSubmit: (formData: PlanItemFormData) => Promise<void>;
  planItem: PlanItem;
  taskNumber: number;
  itemType: PlanItemType;
  navigation: NavigationProp<any>;
}

interface State {
  taskType: PlanItemType;
}

export const PlanItemForm: FC<Props> = ({navigation, onSubmit, planItem, taskNumber, itemType}) => {
  const [state, setState] = useState<State>({
    taskType: planItem ? planItem.type : itemType
  })

  const initialValues: PlanItemFormData = {
    name: planItem
      ? planItem.name
      : `${i18n.t('planItemActivity:newTask')}${taskNumber}`,
    nameForChild: planItem ? planItem.nameForChild : '',
    time: planItem ? planItem.time : 0,
    subItems: [],
    deleteSubItems: [],
    type: planItem ? planItem.type : itemType,
    imageUri: planItem ? planItem.image : '',
    lector: planItem ? planItem.lector : false,
    voicePath: planItem ? planItem.voicePath : '',
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Required!'),
    nameForChild: Yup.string(),
    time: Yup.number(),
  });


  const renderFormControls = (formikProps: FormikProps<PlanItemFormData>) => {
    const { values, handleChange, errors, touched } = formikProps;

    return (
      <>
        <View style={styles.subHeaderContainer}>
          <View>
            <TextInput
              style={styles.textInputContainer}
              textStyle={styles.textInput}
              placeholder={i18n.t('planItemActivity:taskNamePlaceholder')}
              defaultValue={values.name}
              onChangeText={handleChange('name')}
            />
            {errors.name && touched.name && <StyledText style={styles.errorMessage}>{errors.name}</StyledText>}
          </View>
        </View>
        {(state.taskType === PlanItemType.SimpleTask) && <SimpleTask navigation={navigation} style={styles.simpleTaskContainer} planItem={planItem} formikProps={formikProps} />}
        {(state.taskType === PlanItemType.ComplexTask) && <ComplexTask planItem={planItem} formikProps={formikProps} />}
        {(state.taskType === PlanItemType.Interaction) && <Interaction navigation={navigation} style={styles.simpleTaskContainer} planItem={planItem} formikProps={formikProps}/>}
        {(state.taskType === PlanItemType.Break) && <Break navigation={navigation} style={styles.simpleTaskContainer} planItem={planItem} formikProps={formikProps}/>}
      </>
    );
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formikProps) => (renderFormControls(formikProps))}
      </Formik>
  );
}

const styles = StyleSheet.create({
  subHeaderContainer: {
    ...getElevation(5),
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: dimensions.spacingHuge,
    backgroundColor: palette.background,
    borderBottomColor: palette.backgroundAdditional,
    borderBottomWidth: 1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '10%',
  },
  addButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textInput: {
    ...typography.subtitle,
  },
  textInputContainer: {
    width: 288,
  },
  iconButtonContainer: {
    backgroundColor: palette.backgroundAdditional,
    paddingVertical: 4,
    paddingHorizontal: dimensions.spacingSmall,
    borderRadius: 8,
  },
  simpleTaskContainer: {
    flexDirection: 'row',
    height: '100%',
    backgroundColor: palette.backgroundSurface,
    paddingHorizontal: dimensions.spacingHuge,
    paddingTop: dimensions.spacingBig,
    paddingBottom: dimensions.spacingHuge,
  },
  errorMessage: {
    color: palette.error,
  },
});
