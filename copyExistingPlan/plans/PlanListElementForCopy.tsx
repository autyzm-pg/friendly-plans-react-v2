import React, {FC} from 'react';
import {StyleSheet, TouchableHighlight} from 'react-native';

import {StyledText} from '../../components';
import {Plan, PlanItem} from '../../models';
import {Route} from '../../navigation';
import {dimensions, palette, typography} from '../../styles';
import {NavigationProp} from '@react-navigation/native';
import { useCurrentStudentContext } from '../../contexts/CurrentStudentContext';

interface Props {
  plan: Plan;
  navigation: NavigationProp<any>;
}

export const PlanListElementForCopy: FC<Props> = ({plan, navigation}) => {
  
  const {currentStudent} = useCurrentStudentContext();
  const copyPlanAndNavigate = async () => {
    if (currentStudent) {
      const newPlan = await Plan.createPlan(currentStudent?.id, plan.name);
      const planItems = await PlanItem.getPlanItems(plan);
      for (const item of planItems) {
        console.log('ITEM', item)
        await PlanItem.copyPlanItem(newPlan, item.type, item);
      }
    }
    // const currentStudentObject = await getObjectFromDocument(new Student(), await getStudentRef(await AuthUser.getAuthenticatedUser().getCurrentStudent()).get());
    // const studentPlanList = [];
    // let copiedPlanName = plan.name;

    // if (currentStudentObject instanceof Student) {
    //     const snap = await currentStudentObject.getChildCollectionRef().get();
    //     for (let i = 0; i < snap.size; i++) {
    //         studentPlanList.push(await getObjectFromDocument(new Plan(), snap.docs[i]));
    //     }

    //     let doesNotExist = false;
    //     let index = 1;
    //     while (!doesNotExist) {
    //         let exist = false;
    //         for (const element of studentPlanList) {
    //             if (copiedPlanName === element.name) {
    //                 copiedPlanName = plan.name + ' (' + index + ')';
    //                 index++;
    //                 exist = true;
    //                 break;
    //             }
    //         }

    //         doesNotExist = !exist;

    //     }

    // }

    // const newCopiedPlan = await Plan.createPlan(currentStudentObject.id, copiedPlanName);
    // newCopiedPlan.emoji = plan.emoji;
    // await newCopiedPlan.update(newCopiedPlan);

    // const planItemsSnapshot = await plan.getChildCollectionRef().get();

    // for (let i = 0; i < planItemsSnapshot.size; i++) {

    //     const planItem = await getObjectFromDocument(new PlanItem(), planItemsSnapshot.docs[i]);
    //     const newCopiedPlanItem = await PlanItem.createPlanItem(newCopiedPlan, planItem.type, {
    //             name: planItem.name,
    //             time: planItem.time,
    //             nameForChild: planItem.nameForChild,
    //             subItems: [],
    //             type: planItem.type,
    //             deleteSubItems: [],
    //             lector: planItem.lector,
    //             imageUri: planItem.image,
    //             voicePath: planItem.voicePath
    //         },
    //         planItem.itemOrder - 1);

    //     if (newCopiedPlanItem.type === PlanItemType.ComplexTask) {
    //         const subItemsSnapshot = await getPlanSubItemsRef(plan.studentId, plan.id, planItemsSnapshot.docs[i].id).get();

    //         for (let j = 0; j < subItemsSnapshot.size; j++) {
    //             const planSubItem = await getObjectFromDocument(new PlanSubItem(), subItemsSnapshot.docs[j]);
    //             const newCopiedPlanSubItemRef = await PlanSubItem.create(newCopiedPlanItem);
    //             await newCopiedPlanSubItemRef.update({
    //                 'name': planSubItem.name,
    //                 'itemOrder': planSubItem.itemOrder,
    //                 'time': planSubItem.time,
    //                 'image': planSubItem.image,
    //                 'lector': planSubItem.lector,
    //                 'voicePath': planSubItem.voicePath,
    //             });
    //         }

    //     }

    // }

    navigation.navigate(Route.Dashboard, {
      student: currentStudent,
    });
  };

  // const getObjectFromDocument = async (element: any, documentSnapshot: DocumentSnapshot) => {
  //     const object = Object.assign(new element.constructor(), {
  //         ...documentSnapshot.data(),
  //     });
  //     object.id = documentSnapshot.id;
  //     return object;
  // };

  return (
    <TouchableHighlight style={styles.touchable} underlayColor={palette.underlay} onPress={copyPlanAndNavigate}>
      <StyledText style={styles.studentName}>{plan.name}</StyledText>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  touchable: {
    marginHorizontal: -dimensions.spacingBig,
    paddingHorizontal: dimensions.spacingBig,
  },
  studentName: {
    ...typography.subtitle,
    color: palette.textBody,
    marginTop: dimensions.spacingSmall,
    marginBottom: dimensions.spacingSmall,
  },
});