import React, {FC, useState} from 'react';
import {SafeAreaView, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';

import {Card, IconButton, ModalTrigger, StyledText, TextInput} from '../../components';
import {FormikProps} from 'formik';
import {i18n} from '../../locale';
import {PlanItem} from '../../models';
import {Text} from 'react-native-elements';
import {dimensions, palette, typography} from '../../styles';
import {ImagePicker} from './imagePicker/ImagePicker';
import {PlanItemFormData} from './PlanItemForm';
import {TimeSlider} from './TimeSlider';
import {VoicePicker} from './voicePicker/VoicePicker';
import { NavigationProp } from '@react-navigation/native';

interface Props {
    planItem: PlanItem;
    formikProps: FormikProps<PlanItemFormData>;
    style?: StyleProp<ViewStyle>;
    onChange: (text: string) => void;
    onTimeChange: (time: number) => void;
    updateImage: (image: string) => void;
    voiceChange: (voice: { voicePath: string, lector: boolean }) => void;
    itemInfo: {
        name: string;
        time: number;
        key: number;
        image: string;
        lector: boolean;
        voicePath: string;
    };
    navigation: NavigationProp<any>;
}

export const ComplexTaskMainView: FC<Props> = ({
    itemInfo,
    style,
    onChange,
    onTimeChange,
    planItem,
    formikProps,
    updateImage,
    voiceChange,
    navigation
}) => {
    const [time, setTime] = useState(itemInfo.time);

    const handleConfirmTimer = (newTime: number) => {
        setTime(newTime);
    };

    const timeInfo = () => {
        const hours = Math.floor(itemInfo.time / 3600);
        const minutes = Math.floor((itemInfo.time - hours * 3600) / 60);
        const seconds = itemInfo.time - minutes * 60 - hours * 3600;

        return (hours + minutes + seconds) > 0 ? (hours + ':' + minutes + ':' + seconds) : 'none';
    };


    const showInfo = () => {
        return (
            <View style={styles.imageActionContainer}>
                <Text style={{
                    fontSize: 15,
                    color: palette.textBody
                }}>{i18n.t('planItemActivity:infoBoxNameForChild')}</Text>
            </View>
        );
    };

    const showInfoCover = () => {
        return (
            <View style={styles.imageActionContainer}>
                <Text style={{
                    fontSize: 15,
                    color: palette.textBody
                }}>{i18n.t('planItemActivity:complexTaskCoverInfo')}</Text>
            </View>
        );
    };


    return (
        <SafeAreaView style={style}>
            {/*<Card style={[styles.container]}>*/}


            {/*    <View style={{flexDirection: 'row'}}>*/}
            {/*        <TextInput*/}
            {/*            style={styles.imageInputTextContainer}*/}
            {/*            textStyle={styles.imageInputText}*/}
            {/*            placeholder={i18n.t('planItemActivity:taskNameForChild')}*/}
            {/*            defaultValue={itemInfo.name}*/}
            {/*            onChangeText={onChange}*/}
            {/*        />*/}

            {/*        <ModalTrigger*/}
            {/*            title={i18n.t('planItemActivity:infoBox')}*/}
            {/*            modalContent={*/}
            {/*                showInfo()*/}
            {/*            }*/}

            {/*        >*/}
            {/*            <IconButton containerStyle={{marginTop: 53}} name={'information-circle'} type={'ionicon'}*/}
            {/*                        size={40}*/}
            {/*                        disabled color={palette.informationIcon}/>*/}
            {/*        </ModalTrigger>*/}
            {/*    </View>*/}

            {/*    <View style={styles.timerButton}>*/}
            {/*        {(itemInfo.key !== -1) ? <ModalTrigger*/}
            {/*            title={i18n.t('simpleTask:setTimer')}*/}
            {/*            modalContent={*/}
            {/*                <TimeSlider min={[0, 0, 0]} max={[2, 60, 60]} onConfirm={newTime => {*/}
            {/*                    handleConfirmTimer(newTime);*/}
            {/*                    onTimeChange(newTime);*/}
            {/*                }} savedTime={time}/>*/}
            {/*            }*/}
            {/*        >*/}
            {/*            <IconButton*/}
            {/*                name={timeInfo() !== 'none' ? 'timer' : 'alarm-off'}*/}
            {/*                type="material"*/}
            {/*                label={timeInfo() === 'none' ? i18n.t('planItemActivity:timerButton') : timeInfo()}*/}
            {/*                containerStyle={styles.iconButtonContainer}*/}
            {/*                size={24}*/}
            {/*                color={palette.primaryVariant}*/}
            {/*                disabled*/}
            {/*            />*/}
            {/*        </ModalTrigger> : (<ModalTrigger*/}
            {/*            title={i18n.t('planItemActivity:infoBox')}*/}
            {/*            modalContent={*/}
            {/*                showInfoCover()*/}
            {/*            }*/}
            {/*        >*/}
            {/*            <StyledText*/}
            {/*                style={styles.iconButtonContainer}>{i18n.t('planItemActivity:complexTaskCover')}</StyledText>*/}
            {/*        </ModalTrigger>)}*/}
            {/*    </View>*/}
            {/*</Card>*/}


            <Card style={[styles.container]}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                    <VoicePicker planItem={planItem} formikProps={formikProps} navigation={navigation}
                                 updateComplexTaskVoice={voice => voiceChange(voice)}
                                 isComplexTask selected={{
                        key: itemInfo.key,
                        voicePath: itemInfo.voicePath,
                        lector: itemInfo.lector,
                    }}/>

                    {(itemInfo.key !== -1) ? <ModalTrigger
                        title={i18n.t('simpleTask:setTimer')}
                        modalContent={
                            <TimeSlider min={[0, 0, 0]} max={[2, 60, 60]} onConfirm={newTime => {
                                handleConfirmTimer(newTime);
                                onTimeChange(newTime);
                            }} savedTime={time}/>
                        }
                    >
                        <IconButton
                            name={timeInfo() !== 'none' ? 'timer' : 'alarm-off'}
                            type="material"
                            label={timeInfo() === 'none' ? i18n.t('planItemActivity:timerButton') : timeInfo()}
                            containerStyle={styles.iconButtonContainer}
                            size={24}
                            color={palette.primaryVariant}
                            disabled
                        />
                    </ModalTrigger> : (<ModalTrigger
                        title={i18n.t('planItemActivity:infoBox')}
                        modalContent={
                            showInfoCover()
                        }
                    >
                        <StyledText
                            style={styles.iconButtonContainer}>{i18n.t('planItemActivity:complexTaskCover')}</StyledText>
                    </ModalTrigger>)}
                </View>


                <View style={{flexDirection: 'column', alignItems: 'center', marginBottom: 20, height: '100%', width: '100%'}}>
                    <ImagePicker planItem={planItem} formikProps={formikProps} isComplexTask
                                 selected={{key: itemInfo.key, image: itemInfo.image}}
                                 updateComplexTaskImage={image => updateImage(image)}
                                 navigation={navigation}/>

                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <TextInput
                            style={styles.imageInputTextContainer}
                            textStyle={styles.imageInputText}
                            placeholder={i18n.t('planItemActivity:taskNameForChild')}
                            defaultValue={itemInfo.name}
                            onChangeText={onChange}
                        />

                        <ModalTrigger
                            title={i18n.t('planItemActivity:infoBox')}
                            modalContent={
                                showInfo()
                            }
                        >
                            <IconButton containerStyle={{marginTop: 15, marginLeft: 10}} name={'information-circle'}
                                        type={'ionicon'}
                                        size={40} disabled color={palette.informationIcon}/>
                        </ModalTrigger>
                    </View>
                </View>

            </Card>

        </SafeAreaView>
    );

};

const styles = StyleSheet.create({
    imageActionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginTop: dimensions.spacingLarge,
    },
    imagePicker: {
        borderWidth: 1,
        borderRadius: 8,
        borderColor: palette.backgroundSurface,
        paddingHorizontal: 85,
        paddingVertical: 67,
        flex: 1,
        justifyContent: 'center',
    },
    image: {
        width: 412,
        height: 412,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: dimensions.spacingBig,
        paddingBottom: dimensions.spacingHuge,
        height: '90%',
    },
    iconButtonContainer: {
        fontSize: 20,
        // color: palette.textBody,
        backgroundColor: palette.backgroundAdditional,
        paddingVertical: 4,
        paddingHorizontal: dimensions.spacingSmall,
        borderRadius: 8,
    },
    imageInputTextContainer: {
        marginTop: 20,
        marginBottom: 20,
        width: 240,
    },
    imageInputText: {
        ...typography.taskInput,
        textAlign: 'center',
    },
    timerButton: {
        position: 'absolute',
        right: dimensions.spacingBig,
        top: dimensions.spacingBig,
    },
});
