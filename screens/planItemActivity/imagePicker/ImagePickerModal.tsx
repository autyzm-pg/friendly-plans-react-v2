import {i18n} from '../../../locale';
import {noop} from 'lodash';
import {PlanItem} from '../../../models';
import React, {FC, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {dimensions} from '../../../styles';
import {ImageAction} from '../ImageAction';
import {NavigationProp} from '@react-navigation/native';
import {Route} from '../../../navigation/routes';
import {InnerGallery} from '../../../services/InnerGallery';

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
    navigation: NavigationProp<any>;
}

export const ImagePickerModal: FC<Props> = ({
                                            closeModal = noop,
                                            imageUriUpdate,
                                            deleteImageUri,
                                            currentImageUri,
                                            isComplexTask,
                                            selected,
                                            navigation
                                        }) => {

    useEffect(() => {
    }, []);

    const openCamera = async () => {
        closeModal();
        await ImagePicker.openCamera({
        }).then(async (image) => {
            if(!image.path) { return; }
            const fileName = InnerGallery.getFileName(image.path);
            const fileTarPath = await InnerGallery.createUniqueFilePath(InnerGallery.imagesDir, fileName);
            await InnerGallery.moveFile(image.path, fileTarPath, imageUriUpdate);
        });
    };

    const openGallery = async () => {
        closeModal();
        await ImagePicker.openPicker({
            mediaType: 'photo'
        }).then(async (image) => {
            if(!image.path) { return; }
            const fileName = InnerGallery.getFileName(image.path);
            const fileTarPath = await InnerGallery.createUniqueFilePath(InnerGallery.imagesDir, fileName);
            await InnerGallery.copyFile(image.path, fileTarPath, imageUriUpdate);
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
            const fileName = InnerGallery.getFileName(image.path);
            const fileTarPath = await InnerGallery.createUniqueFilePath(InnerGallery.imagesDir, fileName);
            await InnerGallery.moveFile(image.path, fileTarPath, imageUriUpdate);
        });
    };

    const openLibrary = async () => {
        closeModal();
        navigation.navigate(Route.ImageLibrary, {updateImage: imageUriUpdate});
    }

    const deleteImage = async () => {
        closeModal();
        if (selected!.image && isComplexTask) {
            selected!.image = '';
        }
        deleteImageUri();
    };

    /* photo-library */
    return (
        <View style={styles.imageActionContainer}>
            {currentImageUri ?
            <>
                <ImageAction title={i18n.t('planItemActivity:imageActionDeletePhoto')} 
                             onPress={deleteImage}
                             buttonName='delete'
                             buttonType='material'
                             />
                <ImageAction title={i18n.t('planItemActivity:imageActionEditPhoto')} 
                             onPress={openCropper}
                             buttonName='crop'
                             buttonType='material'
                             />
            </>
            :
            <></>
            }
            <ImageAction title={i18n.t('planItemActivity:imageActionLibrary')} 
                         onPress={openLibrary}
                         buttonName='photo-library'
                         buttonType='material'
                         />
            <ImageAction title={i18n.t('planItemActivity:imageActionTakePhoto')} 
                         onPress={openCamera}
                         buttonName='photo-camera'
                         buttonType='material'
                         />
            <ImageAction title={i18n.t('planItemActivity:imageActionBrowse')} 
                         onPress={openGallery}
                         buttonName='file-download'
                         buttonType='material'
                         />
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