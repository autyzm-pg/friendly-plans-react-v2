import {i18n} from '../../locale';
import {PlanItem, PlanItemType, PlanSubItem} from '../../models';
import React from 'react';
import {NavigationInjectedProps} from '@react-navigation/native';
import {PlanItemForm, PlanItemFormData} from './PlanItemForm';

interface State {
  planItem: PlanItem;
}

export class PlanItemTaskScreen extends React.PureComponent<NavigationInjectedProps, State> {
  static navigationOptions = {
    title: i18n.t('planItemActivity:viewTitleTask'),
  };

  state: State = {
    planItem: this.props.navigation.getParam('planItem'),
  };

  getLastItemOrder = (): number => {
    const planItemList = this.props.navigation.getParam('planItemList');
    if (!planItemList.length) {
      return 0;
    }
    const { order } = planItemList[planItemList.length - 1];
    return order;
  };

  createPlanItem = async (data: PlanItemFormData) => {
    const plan = this.props.navigation.getParam('plan');
    const planItem = await PlanItem.createPlanItem(plan, data.type, data, this.getLastItemOrder());

    if (data.type === PlanItemType.ComplexTask){
      if(data.subItems.length > 0) {
        await planItem.getRef().update({nameForChild: data.nameForChild});
        for (const subItem of data.subItems) {
          const planSubItemRef = await PlanSubItem.create(planItem);
          await planSubItemRef.update({'name': subItem.name, 'order': subItem.order, 'time': subItem.time,
            'image': subItem.image, 'lector': subItem.lector, 'voicePath': subItem.voicePath });
        }
      }
    }

    this.setState({planItem});
  };

  updatePlanItem = async (formData: PlanItemFormData) => {
    const { name, nameForChild, time, imageUri, lector, voicePath } = formData;
    await this.state.planItem.update({
      name,
      nameForChild,
      time,
      image: imageUri,
      lector,
      voicePath,
    });

    if(formData.type === PlanItemType.ComplexTask) {

      for (let i = 0; i < formData.subItems.length; i++) {
        formData.subItems[i].order = i;
      }

      for (const subItem of formData.subItems) {
        if (subItem.id) {
          const planSubItemRef = await subItem.getRef();
          await planSubItemRef.update({
            'name': subItem.name, 'order': subItem.order, 'time': subItem.time,
            'image': subItem.image, 'lector': subItem.lector, 'voicePath': subItem.voicePath
          });
        } else {
          const planSubItemRef = await PlanSubItem.create(this.state.planItem);
          await planSubItemRef.update({
            'name': subItem.name, 'order': subItem.order, 'time': subItem.time,
            'image': subItem.image, 'lector': subItem.lector, 'voicePath': subItem.voicePath
          });
        }
      }

      for (const subItem of formData.deleteSubItems) {
        subItem.delete();
      }

    }

    this.setState({ planItem: { ...this.state.planItem, name, nameForChild, time, image: imageUri, lector, voicePath } });
  };

  onSubmit = (formData: PlanItemFormData) =>
    this.state.planItem ? this.updatePlanItem(formData) : this.createPlanItem(formData);

  render() {
    const { planItem } = this.state;

    const planItemList = this.props.navigation.getParam('planItemList');
    const planItemListCount = planItemList ? planItemList.length + 1 : 0;
    const planItemType = this.props.navigation.getParam('planItemType');

    return <PlanItemForm itemType={planItemType} planItem={planItem} onSubmit={this.onSubmit} taskNumber={planItemListCount} />;
  }
}
