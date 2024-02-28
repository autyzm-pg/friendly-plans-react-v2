import React, {FunctionComponent} from 'react';
import {StyleSheet, TouchableHighlight} from 'react-native';

import {StyledText} from '../../components';
import {AuthUser, Plan, PlanItem, PlanItemType, PlanSubItem, Student} from '../../models';
import {Route} from '../../navigation';
import {RNFirebase} from 'react-native-firebase';
import {DocumentSnapshot} from 'react-native-firebase/firestore';
import RNFS, {DocumentDirectoryPath} from 'react-native-fs';
import {NavigationInjectedProps, withNavigation} from '@react-navigation/native';
import {NavigationService} from '../../services';
import {dimensions, palette, typography} from '../../styles';
import {getPlanSubItemsRef, getStudentRef} from '../../models/FirebaseRefProxy';
import {SubscribableModel} from '../../models/SubscribableModel';


interface Props extends NavigationInjectedProps {
    plan: Plan;
}


const PlanName: FunctionComponent<Props> = ({plan, navigation}) => {

    const copyPlanAndNavigate = async () => {
        const currentStudentObject = await getObjectFromDocument(new Student(), await getStudentRef(await AuthUser.getAuthenticatedUser().getCurrentStudent()).get());
        const studentPlanList = [];
        let copiedPlanName = plan.name;

        if (currentStudentObject instanceof Student) {
            const snap = await currentStudentObject.getChildCollectionRef().get();
            for (let i = 0; i < snap.size; i++) {
                studentPlanList.push(await getObjectFromDocument(new Plan(), snap.docs[i]));
            }

            let doesNotExist = false;
            let index = 1;
            while (!doesNotExist) {
                let exist = false;
                for (const element of studentPlanList) {
                    if (copiedPlanName === element.name) {
                        copiedPlanName = plan.name + ' (' + index + ')';
                        index++;
                        exist = true;
                        break;
                    }
                }

                doesNotExist = !exist;

            }

        }

        const newCopiedPlan = await Plan.createPlan(currentStudentObject.id, copiedPlanName);
        newCopiedPlan.emoji = plan.emoji;
        await newCopiedPlan.update(newCopiedPlan);

        const planItemsSnapshot = await plan.getChildCollectionRef().get();

        for (let i = 0; i < planItemsSnapshot.size; i++) {

            const planItem = await getObjectFromDocument(new PlanItem(), planItemsSnapshot.docs[i]);
            const newCopiedPlanItem = await PlanItem.createPlanItem(newCopiedPlan, planItem.type, {
                    name: planItem.name,
                    time: planItem.time,
                    nameForChild: planItem.nameForChild,
                    subItems: [],
                    type: planItem.type,
                    deleteSubItems: [],
                    lector: planItem.lector,
                    imageUri: planItem.image,
                    voicePath: planItem.voicePath
                },
                planItem.order - 1);

            // newCopiedPlanItem.nameForChild = planItem.nameForChild;
            // newCopiedPlanItem.completed = planItem.completed;
            // newCopiedPlanItem.lector = planItem.lector;
            // await newCopiedPlanItem.update(newCopiedPlanItem);

            // const imagePath = planItem.image.replace('file:///', 'file://');
            // const exist = await RNFS.exists(imagePath.substring(0, imagePath.lastIndexOf('/')));
            // if (exist) {
            //     const imageDirectory = imagePath.substring(0, imagePath.lastIndexOf('/'));
            //     let newDirectory = imageDirectory;
            //     let index = 1;
            //     let dirExist = await RNFS.exists(newDirectory);
            //     while (dirExist) {
            //         newDirectory = imageDirectory + '(' + index + ')';
            //         index++;
            //         dirExist = await RNFS.exists(newDirectory);
            //     }
            //
            //     await RNFS.mkdir(newDirectory);
            //
            //     const files = await RNFS.readDir(imageDirectory);
            //     for (const file of files) {
            //         await RNFS.copyFile(file.path, newDirectory);
            //         newCopiedPlanItem.image = newDirectory.replace('file://', 'file:///') + '/' + file.name;
            //     }
            //
            //     await newCopiedPlanItem.update(newCopiedPlanItem);
            // }



            if (newCopiedPlanItem.type === PlanItemType.ComplexTask) {
                const subItemsSnapshot = await getPlanSubItemsRef(plan.studentId, plan.id, planItemsSnapshot.docs[i].id).get();

                for (let j = 0; j < subItemsSnapshot.size; j++) {
                    const planSubItem = await getObjectFromDocument(new PlanSubItem(), subItemsSnapshot.docs[j]);
                    const newCopiedPlanSubItemRef = await PlanSubItem.create(newCopiedPlanItem);
                    await newCopiedPlanSubItemRef.update({
                        'name': planSubItem.name,
                        'order': planSubItem.order,
                        'time': planSubItem.time,
                        'image': planSubItem.image,
                        'lector': planSubItem.lector,
                        'voicePath': planSubItem.voicePath,
                    });
                }

            }

        }

        navigation.navigate(Route.Dashboard, {
            student: currentStudentObject,
        });


    };

    const getObjectFromDocument = async (element: any, documentSnapshot: DocumentSnapshot) => {
        const object = Object.assign(new element.constructor(), {
            ...documentSnapshot.data(),
        });

        object.id = documentSnapshot.id;

        return object;
    };


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


export const PlanListElementForCopy = withNavigation(PlanName);
