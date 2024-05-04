import {FormikProps} from 'formik';
import i18n from 'i18next';
import React, {FC, useState, useEffect} from 'react';
import {Alert, SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';

import {/*ModelSubscriber,*/ PlanItem, PlanSubItem} from '../../models';
import {dimensions, palette} from '../../styles';
import {Button} from '../../components';
import {ComplexTaskCoverCard} from './ComplexTaskCoverCard';
import {ComplexTaskItem} from './ComplexTaskItem';
import {ComplexTaskMainView} from './ComplexTaskMainView';
import {PlanItemFormData} from './PlanItemForm';
import { NavigationProp } from '@react-navigation/native';


interface Props {
    planItem: PlanItem;
    formikProps: FormikProps<PlanItemFormData>;
    navigation: NavigationProp<any>;
    setSubtaskCount: (nr: number) => {}
    onTaskNameForChildChanged: (name: string) => void;
}

interface State {
    planItem: PlanItem;
    subItems: PlanSubItem[];
    formik: FormikProps<PlanItemFormData>;
    selected: number;
    deletedItems: PlanSubItem[];
}

export const ComplexTask: FC<Props> = ({planItem, formikProps, navigation, setSubtaskCount, onTaskNameForChildChanged}) => {
    const [state, setState] = useState<State>({
        planItem: planItem,
        subItems: [],
        formik: formikProps,
        selected: -1,
        deletedItems: [],
    })
    const [forceUpdateFlag, setForceUpdateFlag] = useState(false);

    const forceUpdate = () => {
        setForceUpdateFlag(prevFlag => !prevFlag);
    };

    useEffect(() => {
        componentDidMount();
        return () => {
            PlanSubItem.getPlanSubItems(state.planItem).then(subItems => {
                setSubtaskCount(subItems.length);
            })
            componentWillUnmount();
        }
      }, []);

    const componentDidMount = () => {
        if (state.planItem && state.planItem.id) {
            PlanSubItem.getPlanSubItems(state.planItem).then(subItems => {
                setState(prevState => ({
                    ...prevState,
                    subItems: subItems
                  }));
            })
        }
    }


    const addSubItem = () => {
        const planSubItem = new PlanSubItem();
        planSubItem.name = '';
        planSubItem.time = 0;
        planSubItem.image = '';
        planSubItem.itemOrder = state.subItems.length;
        const subItems = [...state.subItems, planSubItem];
        state.formik.values.subItems = subItems;
        setState(prevState => ({
            ...prevState,
            subItems: subItems,
            selected: planSubItem.itemOrder
          }));
    };


    const removeSubItem = (indexToDelete: number) => {
        const deletedItems = [...state.deletedItems];
        if (state.subItems[indexToDelete].id) {
            deletedItems.push(state.subItems[indexToDelete]);
        }

        const subItems = [...state.subItems];
        subItems.splice(indexToDelete, 1);

        state.formik.values.subItems = subItems;
        state.formik.values.deleteSubItems = deletedItems;
        setState(prevState => ({
            ...prevState,
            subItems: subItems,
            selected: (indexToDelete === state.selected ? -1 : indexToDelete < state.selected ? state.selected - 1 : state.selected),
            deletedItems: deletedItems,
        }));
    };


    const handleTimeChange = (time: number, indexToUpdate: number) => {
        const subItems = [...state.subItems];
        subItems[indexToUpdate].time = time;

        state.formik.values.subItems = subItems;
        setState(prevState => ({...prevState, subItems: subItems}));
    };


    const changeName = (text: string, index: number) => {
        if (index === -1) {
            updateTaskName(text);
            return;
        }
        updateSubItemName(text, index);
    };

    const updateTaskName = (name: string) => {
        state.formik.values.nameForChild = name;
        forceUpdate();
        onTaskNameForChildChanged(name)
    };

    const updateSubItemName = (text: string, indexToUpdate: number) => {
        const subItems = [...state.subItems];
        subItems[indexToUpdate].name = text;

        state.formik.values.subItems = subItems;
        setState(prevState => ({...prevState, subItems: subItems}));
    };


    const updateImage = (image: string, index: number) => {
        if (index === -1) {
            updateTaskImage(image);
            return;
        }

        updateSubItemImage(image, index);
    };

    const updateTaskImage = (image: string) => {
        state.formik.values.imageUri = image;
        forceUpdate();
    };

    const updateSubItemImage = (image: string, indexToUpdate: number) => {
        const subItems = [...state.subItems];
        subItems[indexToUpdate].image = image;

        state.formik.values.subItems = subItems;
        setState(prevState => ({...prevState, subItems: subItems}));
    };


    const changeSelected = (indexToSelect: number) => {
        setState(prevState => ({...prevState, selected: indexToSelect}));
    };


    const updateVoice = (voice: { voicePath: string, lector: boolean }, index: number) => {
        if (index === -1) {
            updateTaskVoice(voice);
            return;
        }

        updateSubItemVoice(voice, index);
    };

    const updateTaskVoice = (voice: { voicePath: string, lector: boolean }) => {
        state.formik.values.voicePath = voice.voicePath;
        state.formik.values.lector = voice.lector;
        forceUpdate();
    };

    const updateSubItemVoice = (voice: { voicePath: string, lector: boolean }, indexToUpdate: number) => {
        const subItems = [...state.subItems];
        subItems[indexToUpdate].voicePath = voice.voicePath;
        subItems[indexToUpdate].lector = voice.lector;

        state.formik.values.subItems = subItems;
        setState(prevState => ({...prevState, subItems: subItems}));
    };


    const renderSubItems = () => {
        const subItems = [...state.subItems];
        const subItemsTSX = [];
        for (let i = 0; i < subItems.length; i++) {
            subItemsTSX.push(<ComplexTaskItem key={i} name={subItems[i].name} image={subItems[i].image}
                                              selected={state.selected === i}
                                              initialTime={subItems[i].time} onDelete={() => removeSubItem(i)}
                                              onSelectChange={() => changeSelected(i)}/>);
        }
        return subItemsTSX;
    };


    const renderMainView = () => {
        const itemInfo = {name: '', time: 0, key: -1, image: '', lector: false, voicePath: ''};
        if (state.selected === -1) {
            itemInfo.name = state.formik.values.nameForChild;
            itemInfo.image = state.formik.values.imageUri;
            itemInfo.lector = state.formik.values.lector;
            itemInfo.voicePath = state.formik.values.voicePath;

            return <ComplexTaskMainView key={itemInfo.key}
                                        updateImage={image => updateImage(image, state.selected)}
                                        onTimeChange={time => handleTimeChange(time, state.selected)}
                                        onChange={text => changeName(text, state.selected)}
                                        voiceChange={voice => updateVoice(voice, state.selected)}
                                        style={styles.simpleTask} planItem={planItem}
                                        formikProps={state.formik}
                                        itemInfo={itemInfo}
                                        navigation={navigation}/>;
        }

        const subItem = state.subItems[state.selected];
        itemInfo.key = state.selected;
        itemInfo.time = subItem.time;
        itemInfo.name = subItem.name;
        itemInfo.image = subItem.image;
        itemInfo.lector = subItem.lector;
        itemInfo.voicePath = subItem.voicePath;
        return <ComplexTaskMainView key={itemInfo.key}
                                    updateImage={image => updateImage(image, state.selected)}
                                    onTimeChange={time => handleTimeChange(time, state.selected)}
                                    onChange={text => changeName(text, state.selected)}
                                    voiceChange={voice => updateVoice(voice, state.selected)}
                                    style={styles.simpleTask} planItem={planItem}
                                    formikProps={state.formik}
                                    itemInfo={itemInfo}
                                    navigation={navigation}/>;
    };


    const componentWillUnmount = () => {
        Alert.alert(
            i18n.t('planItemActivity:alertTitle'),
            planItem ? i18n.t('planItemActivity:alertMessageUpdate') : i18n.t('planItemActivity:alertMessageCreate')
        );
    }

    const saveNewTask = async () => {
        formikProps.submitForm()
    }

    const taskNameForChildChanged = (name: string) => {
      formikProps.setFieldValue('nameForChild', name);
      onTaskNameForChildChanged(name)
    }

    return (
        <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.outerContainer}>
            <View style={styles.container}>
                <View style={styles.complexTask}>
                    <ComplexTaskCoverCard selected={state.selected === -1}
                        name={state.formik.values.nameForChild}
                        image={state.formik.values.imageUri}
                        onSelectChange={() => changeSelected(-1)}/>
                    <ScrollView>
                        {renderSubItems()}
                        <Button buttonStyle={{borderRadius: 12, paddingBottom: 24, paddingTop: 24}} onPress={addSubItem}
                        title={i18n.t('planItemActivity:complexTaskAddSubTaskButton')}/>
                    </ScrollView>
                </View>
                {renderMainView()}   
            </View>
            <View style={{width: '100%', height: 'auto', paddingHorizontal: dimensions.spacingHuge, alignItems: 'center'}}>
                <Button
                    title={i18n.t('planItemActivity:saveComplexTaskButton')}
                    icon={{
                        name: 'check',
                        type: 'material',
                        color: palette.textWhite,
                        size: 22,
                    }}
                    isUppercase
                    onPress={saveNewTask}
                />
            </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeAreaView: {
        backgroundColor: palette.backgroundSurface,
    },
    container: {
        flexDirection: 'row',
        width: '100%',
        height: '94%',
        paddingHorizontal: dimensions.spacingHuge,
        paddingTop: dimensions.spacingBig,
    },
    complexTask: {
        flexGrow: 7,
    },
    simpleTask: {
        flexGrow: 8,
        marginTop: 3,
        width: '40%',
        marginLeft: dimensions.spacingMedium,
        paddingBottom: dimensions.spacingMedium,
    },
    outerContainer: {
        flexDirection: 'column',
        width: '100%',
        height: '94%',
        paddingHorizontal: 0,
        paddingTop: 0,
    },
});
