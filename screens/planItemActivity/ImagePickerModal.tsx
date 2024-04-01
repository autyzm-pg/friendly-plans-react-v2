import {IconButton} from '../../components';
import {i18n} from '../../locale';
import {noop} from 'lodash';
import {PlanItem} from '../../models';
import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {dimensions} from '../../styles';
import {ImageAction} from './ImageAction';

interface Props {
    closeModal?: () => void;
    planItem: PlanItem;
    imageUriUpdate: (imageUri: string) => void;
    deleteImageUri: () => void;
    currentImageUri: string;
    isComplexTask: boolean;
    selected?: {
        key: number;
        image: string;
    };
}

export const ImagePickerModal: FC<Props> = ({
                                                               closeModal = noop,
                                                               imageUriUpdate,
                                                               deleteImageUri,
                                                               currentImageUri,
                                                               isComplexTask,
                                                               selected
                                                           }) => {

    const cleanImage = async () => {
        if (currentImageUri && currentImageUri.includes('data/com.friendlyplans/files/Pictures') && !isComplexTask) {
            await ImagePicker.cleanSingle(currentImageUri).catch(() => {});
        } else if (selected!.image && selected!.image.includes('data/com.friendlyplans/files/Pictures') && isComplexTask) {
            await ImagePicker.cleanSingle(selected!.image).catch(() => {});
        }
    }

    const openCamera = async () => {
        closeModal();
        await ImagePicker.openCamera({}).then(async (image) => {
            if(!image.path) { return; }
            await cleanImage();
            imageUriUpdate(image.path);
        });
      };

    const openGallery = async () => {
        closeModal();
        await ImagePicker.openPicker({
            mediaType: 'photo'
        }).then(async (image) => {
            if(!image.path) { return; }
            await cleanImage();
            imageUriUpdate(image.path);
        });
    };

    const openCropper = async () => {
        closeModal();
        await ImagePicker.openCropper({
            path: currentImageUri,
            width: styles.image.width,
            height: styles.image.height,
            mediaType: 'photo'
        }).then(async (image) => {
            if(!image.path) { return; }
            await cleanImage();
            imageUriUpdate(image.path);
        });
    };

    const deleteImage = async () => {
        closeModal();
        await cleanImage();
        selected!.image = '';
        deleteImageUri();
    };

    return (
        <View style={styles.imageActionContainer}>
            {currentImageUri ?
            <>
                <ImageAction title={i18n.t('planItemActivity:imageActionDeletePhoto')}>
                    <IconButton name="delete" type="material" size={24} onPress={deleteImage}/>
                </ImageAction>
                <ImageAction title={i18n.t('planItemActivity:imageActionCroppPhoto')}>
                    <IconButton name="photo-library" type="material" size={24} onPress={openCropper}/>
                </ImageAction>
            </>
            :
            <></>}
            <ImageAction title={i18n.t('planItemActivity:imageActionTakePhoto')}>
                <IconButton name="photo-camera" type="material" size={24} onPress={openCamera}/>
            </ImageAction>
            <ImageAction title={i18n.t('planItemActivity:imageActionBrowse')}>
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
    image: {
        width: 412,
        height: 412,
    },
});