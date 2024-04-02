import {FormikProps} from 'formik';
import React, {FC, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Image} from 'react-native-elements';

import {Icon, ModalTrigger} from '../../components';
import {i18n} from '../../locale';
import {PlanItem} from '../../models';
import {palette} from '../../styles';
import {ImagePickerModal} from './ImagePickerModal';
import {PlanItemFormData} from './PlanItemForm';
import { NavigationProp } from '@react-navigation/native';

interface Props {
    planItem: PlanItem;
    formikProps: FormikProps<PlanItemFormData>;
    updateComplexTaskImage?: (image: string) => void;
    isComplexTask: boolean;
    selected: {
        key: number;
        image: string;
    };
    navigation: NavigationProp<any>;
}

export const ImagePicker: FC<Props> = ({
                                        planItem,
                                        formikProps,
                                        updateComplexTaskImage,
                                        isComplexTask,
                                        selected,
                                        navigation
                                    }) => {

    const [imageUri, setImageUri] = useState(isComplexTask ? selected.image : formikProps.values.imageUri);

    const updateImagePath = (imagePath: string) => {
        if (isComplexTask) {
            updateComplexTaskImage!(imagePath);
        } else {
            formikProps.setFieldValue('imageUri', imagePath);
        }
        setImageUri(imagePath);
    };

    const deleteImageUri = () => {
        if (isComplexTask) {
            updateComplexTaskImage!('');
        } else {
            formikProps.setFieldValue('imageUri', '');
        }
        setImageUri('');
    };

    const renderImage = () => {
        if (imageUri) {
            return <Image source={{uri: imageUri}} style={styles.image} resizeMode={'contain'}/>;
        }

        return (<View style={{height: 412, width: 412, justifyContent: 'center'}}>
            <Icon name="add-a-photo" type="material" size={250} color={palette.textInputPlaceholder}/>
        </View>);
    };


    return (
        <View style={styles.container}>
            <ModalTrigger
                modalContent={<ImagePickerModal planItem={planItem}
                                                imageUriUpdate={updateImagePath}
                                                deleteImageUri={deleteImageUri}
                                                currentImageUri={imageUri}
                                                isComplexTask={isComplexTask}
                                                selected={selected}
                                                navigation={navigation}/>}
                title={i18n.t('planItemActivity:addImage')}
            >
                <View style={styles.imagePicker}>
                    {renderImage()}
                </View>
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
        flex: 1,
        borderWidth: 3,
        borderRadius: 8,
        borderColor: palette.backgroundSurface,
        borderStyle: 'dashed',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
        width: 460,
        height: 460,
    },
    image: {
        width: 412,
        height: 412,
    },
});