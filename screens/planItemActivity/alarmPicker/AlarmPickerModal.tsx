import {IconButton} from '../../components';
import {i18n} from '../../locale';
import {noop} from 'lodash';
import {PlanItem} from '../../models';
import React, {FunctionComponent} from 'react';
import {StyleSheet, View} from 'react-native';
import DocumentPicker, {types} from 'react-native-document-picker';
import {dimensions} from '../../styles';
import {ImageAction} from '../ImageAction';

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

export const AlarmPickerModal: FunctionComponent<Props> = ({
                                                 closeModal = noop,
                                                 imageUriUpdate, deleteImageUri
                                             }) => {

    // const navigateToImageLibrary = () => {
        // not working
        // closeModal();
        // NavigationService.navigate(Route.ImageLibrary, {
        //     planItem,
        // });
    // };

    // const openCamera = () => {
        // not working
        // closeModal();
        // ImagePicker.launchCamera(
        //     {
        //         mediaType: 'photo',
        //     },
        //     response => {
        //         if (!response.didCancel && !response.errorMessage) {
        //             updateImage(response);
        //         }
        //     },
        // );
    // };

    const openGallery = async () => {
        closeModal();

        const response = await DocumentPicker.pick({
            presentationStyle: 'fullScreen',
            type: types.images,
            allowMultiSelection: false,
            copyTo: 'documentDirectory',
        });

        if (response[0].fileCopyUri) {
            const imageUri = response[0].fileCopyUri!.replace('file:/', 'file:///');
            imageUriUpdate(imageUri);
        }
    };

    const deleteImage = async () => {
        closeModal();
        // if(selected!.image && isComplexTask) {
        //     selected!.image = '';
        // }
        deleteImageUri();
    };

    return (
        <View style={styles.imageActionContainer}>
            <ImageAction title={i18n.t('planItemActivity:imageActionDeletePhoto')}>
                <IconButton name="trash" type="entypo" size={24} onPress={deleteImage}/>
            </ImageAction>
            {/*<ImageAction title={i18n.t('planItemActivity:imageActionTakePhoto')}>*/}
            {/*    <IconButton name="photo-camera" type="material" size={24} onPress={openCamera}/>*/}
            {/*</ImageAction>*/}
            {/*<ImageAction title={i18n.t('planItemActivity:imageActionLibrary')}>*/}
            {/*    <IconButton name="photo-library" type="material" size={24} onPress={navigateToImageLibrary}/>*/}
            {/*</ImageAction>*/}
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
});