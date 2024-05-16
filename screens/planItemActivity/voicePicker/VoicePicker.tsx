import {FormikProps} from 'formik';
import React, {FunctionComponent, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {Icon, ModalTrigger} from '../../../components';
import {i18n} from '../../../locale';
import {PlanItem} from '../../../models';
import {palette} from '../../../styles';
import {PlanItemFormData} from '../PlanItemForm';
import {VoicePickerModal} from './VoicePickerModal';
import { NavigationProp } from '@react-navigation/native';

interface Props {
    planItem: PlanItem;
    formikProps: FormikProps<PlanItemFormData>;
    updateComplexTaskVoice?: (voice: { voicePath: string, lector: boolean }) => void;
    isComplexTask: boolean;
    selected: {
        key: number;
        voicePath: string;
        lector: boolean;
        name: string;
    };
    navigation: NavigationProp<any>;
}

export const VoicePicker: FunctionComponent<Props> = ({
                                                          planItem,
                                                          formikProps,
                                                          isComplexTask,
                                                          selected,
                                                          updateComplexTaskVoice,
                                                          navigation
                                                      }) => {

    const [voice, setVoice] = useState({
        voicePath: isComplexTask ? selected.voicePath : formikProps.values.voicePath,
        lector: isComplexTask ? selected.lector : formikProps.values.lector
    });

    const setVoicePath = (voicePath: string) => {
        if (isComplexTask) {
            selected.voicePath = voicePath;
            selected.lector = false;
            updateComplexTaskVoice!({voicePath, lector: false});
        } else {
            formikProps.setFieldValue('voicePath', voicePath);
            formikProps.setFieldValue('lector', false);
        }
        setVoice({voicePath, lector: false});
    };

    const setLector = () => {
        if (isComplexTask) {
            selected.voicePath = '';
            selected.lector = true;
            updateComplexTaskVoice!({voicePath: '', lector: true});
        } else {
            formikProps.setFieldValue('voicePath', '');
            formikProps.setFieldValue('lector', true);
        }
        setVoice({voicePath: '', lector: true});
    };

    const deleteVoice = () => {
        if (isComplexTask) {
            selected.voicePath = '';
            selected.lector = false;
            updateComplexTaskVoice!({voicePath: '', lector: false});
        } else {
            formikProps.setFieldValue('voicePath', '');
            formikProps.setFieldValue('lector', false);
        }
        setVoice({voicePath: '', lector: false});
    };

    const renderIcon = () => {
        if (voice.lector || voice.voicePath) {
            return (<Icon name="volume-high" type="material-community" size={40} color={palette.primaryVariant}/>);
        }

        return (<Icon name="volume-off" type="material-community" size={40} color={palette.primaryVariant}/>);
    };


    return (
        <View>
            <ModalTrigger
                modalContent={<VoicePickerModal planItem={planItem}
                                                voiceUriUpdate={setVoicePath}
                                                deleteVoice={deleteVoice}
                                                currentVoiceUri={voice.voicePath}
                                                isComplexTask={isComplexTask}
                                                setLector={setLector}
                                                lector={voice.lector}
                                                selected={selected}
                                                navigation={navigation}/>}
                title={i18n.t('planItemActivity:addVoice')}
            >
                {renderIcon()}
            </ModalTrigger>
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
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
        resizeMode: 'contain',
    },
});