import {StyledText, TextInput} from '../../components';
import {Formik, FormikProps} from 'formik';
import {i18n} from '../../locale';
import {PlanItem, PlanItemType, PlanSubItem} from '../../models';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {dimensions, getElevation, palette, typography} from '../../styles';
import * as Yup from 'yup';
import {Break} from './Break';
import {ComplexTask} from './ComplexTask';
import {Interaction} from './Interaction';
import {SimpleTask} from './SimpleTask';

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
}

interface State {
  taskType: PlanItemType;
}

export class PlanItemForm extends React.PureComponent<Props, State> {
  state: State = {
    taskType: this.props.planItem ? this.props.planItem.type : this.props.itemType,
  };

  initialValues: PlanItemFormData = {
    name: this.props.planItem
      ? this.props.planItem.name
      : `${i18n.t('planItemActivity:newTask')}${this.props.taskNumber}`,
    nameForChild: this.props.planItem ? this.props.planItem.nameForChild : '',
    time: this.props.planItem ? this.props.planItem.time : 0,
    subItems: [],
    deleteSubItems: [],
    type: this.props.planItem ? this.props.planItem.type : this.props.itemType,
    imageUri: this.props.planItem ? this.props.planItem.image : '',
    lector: this.props.planItem ? this.props.planItem.lector : false,
    voicePath: this.props.planItem ? this.props.planItem.voicePath : '',
  };

  validationSchema = Yup.object().shape({
    name: Yup.string().required('Required!'),
    nameForChild: Yup.string(),
    time: Yup.number(),
  });


  renderFormControls = (formikProps: FormikProps<PlanItemFormData>) => {
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
        {(this.state.taskType === PlanItemType.SimpleTask) && <SimpleTask style={styles.simpleTaskContainer} planItem={this.props.planItem} formikProps={formikProps} />}
        {(this.state.taskType === PlanItemType.ComplexTask) && <ComplexTask planItem={this.props.planItem} formikProps={formikProps} />}
        {(this.state.taskType === PlanItemType.Interaction) && <Interaction style={styles.simpleTaskContainer} planItem={this.props.planItem} formikProps={formikProps}/>}
        {(this.state.taskType === PlanItemType.Break) && <Break style={styles.simpleTaskContainer} planItem={this.props.planItem} formikProps={formikProps}/>}
      </>
    );
  };

  render() {
    return (
      <Formik
        initialValues={this.initialValues}
        validationSchema={this.validationSchema}
        onSubmit={this.props.onSubmit}
        render={this.renderFormControls}
      />
    );
  }
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
