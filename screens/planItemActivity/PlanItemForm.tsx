import {CheckboxInput, StyledText, TextInput} from '../../components';
import {Formik, FormikProps} from 'formik';
import {i18n} from '../../locale';
import {PlanItem, PlanItemType, PlanSubItem} from '../../models';
import React, {FC, useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {dimensions, getElevation, palette, typography} from '../../styles';
import * as Yup from 'yup';
import {Break} from './Break';
import {ComplexTask} from './ComplexTask';
import {Interaction} from './Interaction';
import {SimpleTask} from './SimpleTask';
import {NavigationProp, RouteProp} from '@react-navigation/native';

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
  onSubmit: (formData: PlanItemFormData) => void;
  planItem: PlanItem;
  itemType: PlanItemType;
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
};

interface State {
  taskType: PlanItemType;
};

export const PlanItemForm: FC<Props> = ({navigation, onSubmit, planItem, itemType, route}) => {
  const [state, setState] = useState<State>({taskType: planItem ? planItem.type : itemType});

  const taskNameForChild = useRef<string | null>(null);

  const [nameForChildAsTaskName, setNameForChildAsTaskName] = useState(true);

  const initialValues: PlanItemFormData = {
    name: planItem
      ? planItem.name
      : '',
    nameForChild: planItem ? planItem.nameForChild : '',
    time: planItem ? planItem.time : 0,
    subItems: [],
    deleteSubItems: [],
    type: planItem ? planItem.type : itemType,
    imageUri: planItem ? planItem.image : '',
    lector: planItem ? planItem.lector : false,
    voicePath: planItem ? planItem.voicePath : '',
  };

  useEffect(() => {
    setNameForChildAsTaskName(!planItem || planItem.name === planItem.nameForChild);
    if (planItem && nameForChildAsTaskName) {
      taskNameForChild.current = planItem.nameForChild
    }
  }, [])

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(i18n.t('common:required')),
    nameForChild: Yup.string(),
    time: Yup.number(),
  });

  const renderFormControls = (formikProps: FormikProps<PlanItemFormData>) => {
    const { values, handleChange, errors, touched, handleSubmit, setFieldValue } = formikProps;

    const setTaskName = (name: string) => {
      taskNameForChild.current = name;
      if (nameForChildAsTaskName) {
        setFieldValue('name', name);
      }
    }

    return (
      <>
        <View style={styles.subHeaderContainer}>
          <View>
            <TextInput
              style={styles.textInputContainer}
              textStyle={styles.textInput}
              placeholder={i18n.t('planItemActivity:taskNamePlaceholder')}
              defaultValue={values.name}
              onChangeText={(value) => {
                nameForChildAsTaskName
                  ? setTaskName(value)
                  : setFieldValue('name', value);
              }}
              editable={true}
            />
            {errors.name && touched.name && <StyledText style={styles.errorMessage}>{errors.name}</StyledText>}
          </View>
          <CheckboxInput
              title={i18n.t('planItemActivity:nameForChildAsTaskName')}
              checked={nameForChildAsTaskName} 
              onPress={(value) => {
                setNameForChildAsTaskName(value)
                if (value) {
                  setFieldValue('name', taskNameForChild.current);
                }
              }}
            />
        </View>
        {(state.taskType === PlanItemType.SimpleTask) && <SimpleTask navigation={navigation} style={styles.simpleTaskContainer} planItem={planItem} formikProps={formikProps} taskName={taskNameForChild.current} onTaskNameForChildChanged={setTaskName}/>}
        {(state.taskType === PlanItemType.ComplexTask) && <ComplexTask navigation={navigation} planItem={planItem} formikProps={formikProps} setSubtaskCount={route.params?.setSubtaskCount} taskName={taskNameForChild.current} onTaskNameForChildChanged={setTaskName} />}
        {(state.taskType === PlanItemType.Interaction) && <Interaction navigation={navigation} style={styles.simpleTaskContainer} planItem={planItem} formikProps={formikProps} taskName={taskNameForChild.current} onTaskNameForChildChanged={setTaskName}/>}
        {(state.taskType === PlanItemType.Break) && <Break navigation={navigation} style={styles.simpleTaskContainer} planItem={planItem} formikProps={formikProps} taskName={taskNameForChild.current} onTaskNameForChildChanged={setTaskName}/>}

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
    marginRight: dimensions.spacingSmall
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
