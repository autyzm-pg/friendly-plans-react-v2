import {IconButton} from 'components';
import {i18n} from 'locale';
import {noop} from 'lodash';
import {PlanItem} from 'models';
import React, {FunctionComponent} from 'react';
import {StyleSheet, View} from 'react-native';
import DocumentPicker, {types} from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import {dimensions} from '../styles';
import {ImageAction} from '../ImageAction';

interface Props {
    closeModal?: () => void;
    planItem: PlanItem;
    voiceUriUpdate: (imageUri: string) => void;
    deleteVoice: () => void;
    currentVoiceUri: string;
    setLector: () => void;
    isComplexTask: boolean;
    selected?: {
        key: number;
        voicePath: string;
        lector: boolean;
    };
}

export const VoicePickerModal: FunctionComponent<Props> = ({
                                                               closeModal = noop,
                                                               voiceUriUpdate, deleteVoice,
                                                               currentVoiceUri,
                                                               isComplexTask, selected,
                                                               setLector
                                                           }) => {

    const openGallery = async () => {
        closeModal();

        const response = await DocumentPicker.pick({
            presentationStyle: 'fullScreen',
            type: types.audio,
            allowMultiSelection: false,
            copyTo: 'documentDirectory',
        });

        if (response[0].fileCopyUri) {
            const voiceUri = response[0].fileCopyUri!.replace('file:/', 'file:///');
            if (currentVoiceUri && !isComplexTask) {
                await ImagePicker.cleanSingle(currentVoiceUri.substring(0, currentVoiceUri.lastIndexOf('/')))
                    .catch(() => voiceUriUpdate(voiceUri));
            } else if (selected!.voicePath && isComplexTask) {
                await ImagePicker.cleanSingle(selected!.voicePath.substring(0, selected!.voicePath.lastIndexOf('/')))
                    .catch(() => voiceUriUpdate(voiceUri));
            }
            voiceUriUpdate(voiceUri);
        }
    };

    const callSetLector = () => {
        closeModal();
        setLector();
    };

    const callDeleteVoice = async () => {
        closeModal();
        if (currentVoiceUri && !isComplexTask) {
            await ImagePicker.cleanSingle(currentVoiceUri.substring(0, currentVoiceUri.lastIndexOf('/')))
                .catch(deleteVoice);
        } else if (selected!.voicePath && isComplexTask) {
            await ImagePicker.cleanSingle(selected!.voicePath.substring(0, selected!.voicePath.lastIndexOf('/')))
                .catch(deleteVoice);
            // selected!.voicePath = '';
        }
        deleteVoice();
    };

    return (
        <View style={styles.imageActionContainer}>
            <ImageAction title={i18n.t('planItemActivity:voiceActionDeleteVoice')}>
                <IconButton name="trash" type="entypo" size={24} onPress={callDeleteVoice}/>
            </ImageAction>
            <ImageAction title={i18n.t('planItemActivity:voiceActionSetLector')}>
                <IconButton name="megaphone" type="entypo" size={24} onPress={callSetLector}/>
            </ImageAction>
            <ImageAction title={i18n.t('planItemActivity:voiceActionAddRecord')}>
                <IconButton name="file-download" type="material" size={24} onPress={openGallery}/>
            </ImageAction>
        </View>
    );
};

const styles = StyleSheet.create({
    imageActionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginTop: dimensions.spacingLarge,
    },
});