import {IconButton} from '../../../components';
import {i18n} from '../../../locale';
import {noop} from 'lodash';
import {PlanItem} from '../../../models';
import React, {FC, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {dimensions} from '../../../styles';
import {ImageAction} from '../ImageAction';
import RNFS from 'react-native-fs';
import {NavigationProp} from '@react-navigation/native';
import {Route} from '../../../navigation/routes';

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

    const imagesDir = RNFS.DocumentDirectoryPath + '/Images/';

    useEffect(() => {
        RNFS.exists(imagesDir)
        .then((exists) => {
            if (exists) { return; }
            RNFS.mkdir(imagesDir)
                .then(() => {
                    // console.log('Created: ' + imagesDir)
                })
                .catch((error) => {
                    // console.error('Error creating: ' + imagesDir, error);
                });
        })
        .catch((error) => {
            // console.error('Cannot check if directory exists: ' + imagesDir, error);
        });
    }, [])

    const openCamera = async () => {
        closeModal();
        await ImagePicker.openCamera({
        }).then(async (image) => {
            if(!image.path) { return; }
            const fileTargetPath = imagesDir + image.path.substring(image.path.lastIndexOf('/') + 1);
            await RNFS.moveFile(image.path, fileTargetPath)
            .then(() => {
                // console.log('Image moved to: ' + fileTargetPath);
                imageUriUpdate('file://' + fileTargetPath);
            })
            .catch((error) => {
                console.error('Error moving image: ', error);
            });
        });
      };

    const openGallery = async () => {
        closeModal();
        await ImagePicker.openPicker({
            mediaType: 'photo'
        }).then(async (image) => {
            if(!image.path) { return; }
            const fileTargetPath = imagesDir + image.path.substring(image.path.lastIndexOf('/') + 1);
            await RNFS.copyFile(image.path, fileTargetPath)
            .then(() => {
                // console.log('Image copied to: ' + fileTargetPath);
                imageUriUpdate('file://' + fileTargetPath);
            })
            .catch((error) => {
                console.error('Error copying image: ', error);
            });
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
            const fileTargetPath = imagesDir + image.path.substring(image.path.lastIndexOf('/') + 1);
            await RNFS.moveFile(image.path, fileTargetPath)
            .then(() => {
                // console.log('Image moved to: ' + fileTargetPath);
                imageUriUpdate('file://' + fileTargetPath);
            })
            .catch((error) => {
                console.error('Error moving image: ', error);
            });
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
                <ImageAction title={i18n.t('planItemActivity:imageActionDeletePhoto')} onPress={deleteImage}>
                    <IconButton name="delete" type="material" size={24} onPress={deleteImage}/>
                </ImageAction>
                <ImageAction title={i18n.t('planItemActivity:imageActionEditPhoto')} onPress={openCropper}>
                    <IconButton name="crop" type="material" size={24} onPress={openCropper}/>
                </ImageAction>
            </>
            :
            <></>}
            <ImageAction title={i18n.t('planItemActivity:imageActionLibrary')} onPress={openLibrary}>
                <IconButton name="photo-library" type="material" size={24} onPress={openLibrary}/>
            </ImageAction>
            <ImageAction title={i18n.t('planItemActivity:imageActionTakePhoto')} onPress={openCamera}>
                <IconButton name="photo-camera" type="material" size={24} onPress={openCamera}/>
            </ImageAction>
            <ImageAction title={i18n.t('planItemActivity:imageActionBrowse')} onPress={openGallery}>
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