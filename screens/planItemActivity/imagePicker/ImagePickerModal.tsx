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
import uuid from 'react-native-uuid';

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
    }, []);

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

    const splitToNameExtension = (fileName: string) => {
        const idx = fileName.lastIndexOf('.');
        if (idx !== -1) {
          const name = fileName.substring(0, idx);
          const extension = fileName.substring(idx + 1);
          return [name, extension];
        }
        return fileName;
    };

    const openGallery = async () => {
        closeModal();
        await ImagePicker.openPicker({
            mediaType: 'photo'
        }).then(async (image) => {
            if(!image.path) { return; }
            let fileTargetPath = imagesDir + image.path.substring(image.path.lastIndexOf('/') + 1);
            const doesFileExist = await RNFS.exists(fileTargetPath);
            if (doesFileExist) { 
                const [name, extension] = splitToNameExtension(image.path.substring(image.path.lastIndexOf('/') + 1));
                fileTargetPath = imagesDir + name + '_' + uuid.v4() + '.' + extension;
            }
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