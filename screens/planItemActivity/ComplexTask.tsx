import {FormikProps} from 'formik';
import i18n from 'i18next';
import React from 'react';
import {Alert, SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';

import {ModelSubscriber, PlanItem, PlanSubItem} from '../../models';
import {dimensions, palette} from '../../styles';
import {Button} from '../../components';
import {ComplexTaskCoverCard} from './ComplexTaskCoverCard';
import {ComplexTaskItem} from './ComplexTaskItem';
import {ComplexTaskMainView} from './ComplexTaskMainView';
import {PlanItemFormData} from './PlanItemForm';


interface Props {
    planItem: PlanItem;
    formikProps: FormikProps<PlanItemFormData>;
}

interface State {
    planItem: PlanItem;
    subItems: PlanSubItem[];
    formik: FormikProps<PlanItemFormData>;
    selected: number;
    deletedItems: PlanSubItem[];
}

export class ComplexTask extends React.PureComponent<Props, State> {
    modelSubscriber: ModelSubscriber<PlanSubItem> = new ModelSubscriber();
    state: State = {
        planItem: this.props.planItem,
        subItems: [],
        formik: this.props.formikProps,
        selected: -1,
        deletedItems: [],
    };

    componentDidMount() {
        if (this.state.planItem && this.state.planItem.id) {
            this.modelSubscriber.subscribeCollectionUpdates(this.state.planItem, (subItems: PlanSubItem[]) => {
                const sortedItems = subItems.sort((a, b) => (a.order > b.order) ? 1 : -1);
                this.setState({subItems: sortedItems});
            });
        }
    }


    addSubItem = () => {
        const planSubItem = new PlanSubItem();
        planSubItem.name = '';
        planSubItem.time = 0;
        planSubItem.image = '';
        planSubItem.order = this.state.subItems.length;
        const subItems = [...this.state.subItems, planSubItem];
        this.state.formik.values.subItems = subItems;
        this.setState({subItems});
    };


    removeSubItem = (indexToDelete: number) => {
        const deletedItems = [...this.state.deletedItems];
        if (this.state.subItems[indexToDelete].id) {
            deletedItems.push(this.state.subItems[indexToDelete]);
        }

        const subItems = [...this.state.subItems];
        subItems.splice(indexToDelete, 1);

        this.state.formik.values.subItems = subItems;
        this.state.formik.values.deleteSubItems = deletedItems;
        this.setState({
            subItems,
            selected: indexToDelete === this.state.selected ? -1 : indexToDelete < this.state.selected ? this.state.selected - 1 : this.state.selected,
            deletedItems,
        });
    };


    handleTimeChange = (time: number, indexToUpdate: number) => {
        const subItems = [...this.state.subItems];
        subItems[indexToUpdate].time = time;

        this.state.formik.values.subItems = subItems;
        this.setState({subItems});
    };


    changeName = (text: string, index: number) => {
        if (index === -1) {
            this.updateTaskName(text);
            return;
        }
        this.updateSubItemName(text, index);
    };

    updateTaskName = (name: string) => {
        this.state.formik.values.nameForChild = name;
        this.forceUpdate();
    };

    updateSubItemName = (text: string, indexToUpdate: number) => {
        const subItems = [...this.state.subItems];
        subItems[indexToUpdate].name = text;

        this.state.formik.values.subItems = subItems;
        this.setState({subItems});
    };


    updateImage = (image: string, index: number) => {
        if (index === -1) {
            this.updateTaskImage(image);
            return;
        }

        this.updateSubItemImage(image, index);
    };

    updateTaskImage = (image: string) => {
        this.state.formik.values.imageUri = image;
        this.forceUpdate();
    };

    updateSubItemImage = (image: string, indexToUpdate: number) => {
        const subItems = [...this.state.subItems];
        subItems[indexToUpdate].image = image;

        this.state.formik.values.subItems = subItems;
        this.setState({subItems});
    };


    changeSelected = (indexToSelect: number) => {
        this.setState({selected: indexToSelect});
    };


    updateVoice = (voice: { voicePath: string, lector: boolean }, index: number) => {
        if (index === -1) {
            this.updateTaskVoice(voice);
            return;
        }

        this.updateSubItemVoice(voice, index);
    };

    updateTaskVoice = (voice: { voicePath: string, lector: boolean }) => {
        this.state.formik.values.voicePath = voice.voicePath;
        this.state.formik.values.lector = voice.lector;
        this.forceUpdate();
    };

    updateSubItemVoice = (voice: { voicePath: string, lector: boolean }, indexToUpdate: number) => {
        const subItems = [...this.state.subItems];
        subItems[indexToUpdate].voicePath = voice.voicePath;
        subItems[indexToUpdate].lector = voice.lector;

        this.state.formik.values.subItems = subItems;
        this.setState({subItems});
    };


    renderSubItems = () => {
        const subItems = [...this.state.subItems];
        const subItemsTSX = [];
        for (let i = 0; i < subItems.length; i++) {
            subItemsTSX.push(<ComplexTaskItem key={i} name={subItems[i].name} image={subItems[i].image}
                                              selected={this.state.selected === i}
                                              initialTime={subItems[i].time} onDelete={() => this.removeSubItem(i)}
                                              onSelectChange={() => this.changeSelected(i)}/>);
        }
        return subItemsTSX;
    };


    renderMainView = () => {
        const itemInfo = {name: '', time: 0, key: -1, image: '', lector: false, voicePath: ''};
        if (this.state.selected === -1) {
            itemInfo.name = this.state.formik.values.nameForChild;
            itemInfo.image = this.state.formik.values.imageUri;
            itemInfo.lector = this.state.formik.values.lector;
            itemInfo.voicePath = this.state.formik.values.voicePath;

            return <ComplexTaskMainView key={itemInfo.key}
                                        updateImage={image => this.updateImage(image, this.state.selected)}
                                        onTimeChange={time => this.handleTimeChange(time, this.state.selected)}
                                        onChange={text => this.changeName(text, this.state.selected)}
                                        voiceChange={voice => this.updateVoice(voice, this.state.selected)}
                                        style={styles.simpleTask} planItem={this.props.planItem}
                                        formikProps={this.state.formik}
                                        itemInfo={itemInfo}/>;
        }

        const subItem = this.state.subItems[this.state.selected];
        itemInfo.key = this.state.selected;
        itemInfo.time = subItem.time;
        itemInfo.name = subItem.name;
        itemInfo.image = subItem.image;
        itemInfo.lector = subItem.lector;
        itemInfo.voicePath = subItem.voicePath;
        return <ComplexTaskMainView key={itemInfo.key}
                                    updateImage={image => this.updateImage(image, this.state.selected)}
                                    onTimeChange={time => this.handleTimeChange(time, this.state.selected)}
                                    onChange={text => this.changeName(text, this.state.selected)}
                                    voiceChange={voice => this.updateVoice(voice, this.state.selected)}
                                    style={styles.simpleTask} planItem={this.props.planItem}
                                    formikProps={this.state.formik}
                                    itemInfo={itemInfo}/>;
    };


    componentWillUnmount() {
        this.state.formik.submitForm();

        if (this.state.planItem && this.state.planItem.id) {
            this.modelSubscriber.unsubscribeCollectionUpdates();
        }

        Alert.alert(
            i18n.t('planItemActivity:alertTitle'),
            this.props.planItem ? i18n.t('planItemActivity:alertMessageUpdate') : i18n.t('planItemActivity:alertMessageCreate')
        );
    }

    render() {
        return (
            <SafeAreaView style={styles.safeAreaView}>
                <View style={styles.container}>
                    <View style={styles.complexTask}>
                        <ComplexTaskCoverCard selected={this.state.selected === -1}
                                              name={this.state.formik.values.nameForChild}
                                              image={this.state.formik.values.imageUri}
                                              onSelectChange={() => this.changeSelected(-1)}/>
                        <ScrollView>
                            {this.renderSubItems()}
                            <Button buttonStyle={{borderRadius: 12, paddingBottom: 24, paddingTop: 24}} onPress={this.addSubItem}
                                    title={i18n.t('planItemActivity:complexTaskAddSubTaskButton')}/>
                        </ScrollView>
                    </View>
                    {this.renderMainView()}
                </View>
            </SafeAreaView>
        );
    }
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
        paddingBottom: dimensions.spacingLarge,
    },
});
