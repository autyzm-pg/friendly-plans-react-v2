import {FormikProps} from 'formik';
import i18n from 'i18next';
import React, {FC, useState, useEffect, useRef} from 'react';
import {Alert, Platform, SafeAreaView, ScrollView, StyleSheet, ToastAndroid, View, TouchableOpacity, Text} from 'react-native';

import {/*ModelSubscriber,*/ PlanItem, PlanSubItem} from '../../models';
import {dimensions, palette, typography} from '../../styles';
import {Button} from '../../components';
import {ComplexTaskCoverCard} from './ComplexTaskCoverCard';
import {ComplexTaskItem} from './ComplexTaskItem';
import {ComplexTaskMainView} from './ComplexTaskMainView';
import {PlanItemFormData} from './PlanItemForm';
import { NavigationProp } from '@react-navigation/native';
import DraggableFlatList, {
    DragEndParams, NestableDraggableFlatList,
    NestableScrollContainer,
    RenderItemParams
} from "react-native-draggable-flatlist";
import { PlanItemState } from "../../contexts/PlanActivityContext.tsx";


interface Props {
    planItem: PlanItem;
    formikProps: FormikProps<PlanItemFormData>;
    navigation: NavigationProp<any>;
    taskName: string | null;
    setSubtaskCount: (nr: number) => {}
    onTaskNameForChildChanged: (name: string) => void;
}

interface State {
    planItem: PlanItem;
    subItems: PlanSubItem[];
    formik: FormikProps<PlanItemFormData>;
    selectedItemOrder: number;
    deletedItems: PlanSubItem[];
}

export const ComplexTask: FC<Props> = ({planItem, formikProps, navigation, taskName, setSubtaskCount, onTaskNameForChildChanged}) => {
    const [state, setState] = useState<State>({
        planItem: planItem,
        subItems: [],
        formik: formikProps,
        selectedItemOrder: -1,
        deletedItems: [],
    })
    const subItemsRef = useRef<PlanSubItem[]>([]);

    const [forceUpdateFlag, setForceUpdateFlag] = useState(false);

    const taskSaved = useRef(false);

    const forceUpdate = () => {
        setForceUpdateFlag(prevFlag => !prevFlag);
    };

    useEffect(() => {
        componentDidMount();
        return () => {
            PlanSubItem.getPlanSubItems(state.planItem).then(subItems => {
                setSubtaskCount(subItems.length);
            })
        }
      }, []);

    const componentDidMount = () => {
        if (state.planItem && state.planItem.id) {
            PlanSubItem.getPlanSubItems(state.planItem).then(subItems => {
                const sortedSubItems = subItems.sort((a, b) => a.itemOrder - b.itemOrder);

                setState(prevState => ({
                    ...prevState,
                    subItems: sortedSubItems
                  }));
                  subItemsRef.current = sortedSubItems;
            })
        }
    }

    const getIndexOfItemOrder = (itemOrder: number) => {
        if(itemOrder === -1) {
            return -1;
        }

        return state.subItems.findIndex(subItem => subItem.itemOrder === itemOrder);
    }


    const addSubItem = () => {
        const planSubItem = new PlanSubItem();
        planSubItem.name = '';
        planSubItem.nameForChild = '';
        planSubItem.time = 0;
        planSubItem.image = '';
        planSubItem.itemOrder = state.subItems.length;
        const subItems = [...state.subItems, planSubItem];
        state.formik.values.subItems = subItems;
        formikProps.values.subItems = subItems;
        subItemsRef.current = subItems;
        setState(prevState => ({
            ...prevState,
            subItems: subItems,
            selectedItemOrder: planSubItem.itemOrder
          }));
    };

    const removeSubItem = (itemOrderToDelete: number) => {
        const indexToDelete = getIndexOfItemOrder(itemOrderToDelete);
        const deletedItems = [...state.deletedItems];
        if (state.subItems[indexToDelete].id) {
            deletedItems.push(state.subItems[indexToDelete]);
        }

        const subItems = [...state.subItems];
        subItems.splice(indexToDelete, 1);

        state.formik.values.subItems = subItems;
        state.formik.values.deleteSubItems = deletedItems;
        formikProps.values.subItems = subItems;
        formikProps.values.deleteSubItems = deletedItems;
        subItemsRef.current = subItems;
        setState(prevState => ({
            ...prevState,
            subItems: subItems,
            selectedItemOrder: (itemOrderToDelete === state.selectedItemOrder ? -1 : itemOrderToDelete < state.selectedItemOrder ? state.selectedItemOrder - 1 : state.selectedItemOrder),
            deletedItems: deletedItems,
        }));
    };


    const handleTimeChange = (time: number, indexToUpdate: number) => {
        const subItems = [...state.subItems];
        subItems[indexToUpdate].time = time;

        state.formik.values.subItems = subItems;
        formikProps.values.subItems = subItems;
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
        formikProps.values.nameForChild = name;
        forceUpdate();
        onTaskNameForChildChanged(name)
    };

    useEffect(() => {
        if (taskName != null) {
            state.formik.values.nameForChild = taskName;
            formikProps.values.nameForChild = taskName;
        }
    }, [taskName])

    const updateSubItemName = (text: string, indexToUpdate: number) => {
        const subItems = [...state.subItems];
        subItems[indexToUpdate].name = text;
        subItems[indexToUpdate].nameForChild = text;

        state.formik.values.subItems = subItems;
        formikProps.values.subItems = subItems;
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
        formikProps.values.imageUri = image;
        forceUpdate();
    };

    const updateSubItemImage = (image: string, indexToUpdate: number) => {
        const subItems = [...state.subItems];
        subItems[indexToUpdate].image = image;

        state.formik.values.subItems = subItems;
        formikProps.values.subItems = subItems;
        setState(prevState => ({...prevState, subItems: subItems}));
    };


    const changeSelected = (itemOrderToSelect: number) => {
        const indexToSelect = getIndexOfItemOrder(itemOrderToSelect);
        setState(prevState => ({...prevState, selectedItemOrder: indexToSelect}));
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
        formikProps.values.voicePath = voice.voicePath;
        formikProps.values.lector = voice.lector;
        forceUpdate();
    };

    const updateSubItemVoice = (voice: { voicePath: string, lector: boolean }, indexToUpdate: number) => {
        const subItems = [...state.subItems];
        subItems[indexToUpdate].voicePath = voice.voicePath;
        subItems[indexToUpdate].lector = voice.lector;

        state.formik.values.subItems = subItems;
        formikProps.values.subItems = subItems;
        setState(prevState => ({...prevState, subItems: subItems}));
    };

    const renderMainView = () => {
        const itemInfo = {name: '', time: 0, key: -1, image: '', lector: false, voicePath: ''};
        if (state.selectedItemOrder === -1) {
            const index = getIndexOfItemOrder(state.selectedItemOrder);
            itemInfo.name = state.formik.values.nameForChild;
            itemInfo.image = state.formik.values.imageUri;
            itemInfo.lector = state.formik.values.lector;
            itemInfo.voicePath = state.formik.values.voicePath;

            return <ComplexTaskMainView key={itemInfo.key}
                                        updateImage={image => updateImage(image, index)}
                                        onTimeChange={time => handleTimeChange(time, index)}
                                        onChange={text => changeName(text, index)}
                                        voiceChange={voice => updateVoice(voice, index)}
                                        style={styles.simpleTask} planItem={planItem}
                                        formikProps={state.formik}
                                        itemInfo={itemInfo}
                                        navigation={navigation}/>;
        }

        const index = getIndexOfItemOrder(state.selectedItemOrder);
        const subItem = state.subItems[index];
        itemInfo.key = index;
        itemInfo.time = subItem.time;
        itemInfo.name = subItem.name;
        itemInfo.image = subItem.image;
        itemInfo.lector = subItem.lector;
        itemInfo.voicePath = subItem.voicePath;
        return <ComplexTaskMainView key={itemInfo.key}
                                    updateImage={image => updateImage(image, index)}
                                    onTimeChange={time => handleTimeChange(time, index)}
                                    onChange={text => changeName(text, index)}
                                    voiceChange={voice => updateVoice(voice, index)}
                                    style={styles.simpleTask} planItem={planItem}
                                    formikProps={state.formik}
                                    itemInfo={itemInfo}
                                    navigation={navigation}/>;
    };

    const popUpNoSubTaskAlert = () => {
        Alert.alert(
            i18n.t('planItemActivity:alertMessageTitleNoSubTasks'),
            i18n.t('planItemActivity:alertMessageNoSubTasks'),
            [
                { text: i18n.t('common:ok'), onPress: () => {} }
            ],
            { cancelable: false }
        );
    };

    const saveNewTask = async () => {
        taskSaved.current = true;
        formikProps.submitForm();
        ToastAndroid.show(i18n.t('planItemActivity:savedMessage'), 2.5);
    }

    useEffect(
        () =>
        navigation.addListener('beforeRemove', (e) => {
            if (!taskSaved.current) {
            // Prevent default behavior of leaving the screen
            e.preventDefault();

            // Prompt the user before leaving the screen
            Alert.alert(
                i18n.t('planItemActivity:alertMessageSaveQuestionTitle'),
                i18n.t('planItemActivity:alertMessageSaveQuestion'),
                [
                {
                    text: i18n.t('planItemActivity:alertMessageSaveQuestionDiscard'),
                    style: 'destructive',
                    onPress: () => navigation.dispatch(e.data.action) },
                {
                    text: i18n.t('planItemActivity:alertMessageSaveQuestionSave'),
                    style: 'default',
                    onPress: () => {
                        if (subItemsRef.current.length == 0) {
                            popUpNoSubTaskAlert();
                            return;
                        }
                        saveNewTask();
                    }
                },
                ],
                {
                cancelable: true,
                onDismiss: () => {}
                },
            );
            }
        }),
    [navigation])

    const renderAddTaskButton = () => {
        const version = Platform.Version;
        if (version === 22) {
            return (<TouchableOpacity onPress={addSubItem}
                        style={{borderRadius: 12, paddingBottom: 24, paddingTop: 24,
                        backgroundColor: palette.primary, alignItems: 'center'}}>
                        <Text style={{...typography.button, color: palette.textWhite}}>
                            {i18n.t('planItemActivity:complexTaskAddSubTaskButton')}
                        </Text>
                    </TouchableOpacity>);
        }
        return (
            <Button buttonStyle={{borderRadius: 12, paddingBottom: 24, paddingTop: 24}} onPress={addSubItem}
                    title={i18n.t('planItemActivity:complexTaskAddSubTaskButton')}/>
        );
    };

    const renderItem = ({ item, drag }: RenderItemParams<PlanSubItem>) => {
        return (
          <ComplexTaskItem
            key={item.id}
            name={item.name}
            image={item.image}
            selected={state.selectedItemOrder === item.itemOrder}
            initialTime={item.time}
            onDelete={() => removeSubItem(item.itemOrder)}
            onSelectChange={() => changeSelected(item.itemOrder)}
            onLongPress={drag}
          />
        );
    };

    const keyExtractor = (item: PlanSubItem) => `draggable-item-${item.id}`;

    const handleTaskSubItemsOrderChanged = ({ data, from, to }: DragEndParams<PlanSubItem>) => {
        const reorderedSubItems = data.map((item, index) => {
            return {...item, itemOrder: index, };
        });

        state.formik.values.subItems = reorderedSubItems;
        formikProps.values.subItems = reorderedSubItems;
        subItemsRef.current = reorderedSubItems;

        const draggedItem = reorderedSubItems[to];

        setState(prevState => ({
            ...prevState,
            subItems: reorderedSubItems,
            selectedItemOrder: draggedItem.itemOrder,
        }));
    };

    return (
        <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.outerContainer}>
            <View style={styles.container}>
                <View style={styles.complexTask}>
                    <ComplexTaskCoverCard selected={state.selectedItemOrder === -1}
                        name={state.formik.values.nameForChild}
                        image={state.formik.values.imageUri}
                        onSelectChange={() => changeSelected(-1)}/>

                    <NestableScrollContainer>
                        <NestableDraggableFlatList
                          data={state.subItems}
                          renderItem={renderItem}
                          keyExtractor={keyExtractor}
                          onDragEnd={handleTaskSubItemsOrderChanged}
                        />
                        {renderAddTaskButton()}
                    </NestableScrollContainer>
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
                    onPress={() => {
                        if (state.subItems.length == 0) {
                            popUpNoSubTaskAlert();
                            return;
                        }
                        saveNewTask();
                    }}
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
