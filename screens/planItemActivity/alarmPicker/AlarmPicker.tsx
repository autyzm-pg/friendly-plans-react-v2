import {FormikProps} from 'formik';
import React, {FunctionComponent, PureComponent, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Image} from 'react-native-elements';

import {Icon, ModalTrigger} from '../../components';
import {i18n} from '../../locale';
import {PlanItem} from '../../models';
import {palette} from '../../styles';
import {PlanItemFormData} from '../PlanItemForm';
import {AlarmPickerModal} from './AlarmPickerModal';

interface Props {
    planItem: PlanItem;
    formikProps: FormikProps<PlanItemFormData>;
    updateComplexTaskImage?: (image: string) => void;
    isComplexTask: boolean;
    selected: {
        key: number;
        image: string;
    };
}

export const AlarmPicker: FunctionComponent<Props> = ({
                                                          planItem,
                                                          formikProps,
                                                          updateComplexTaskImage,
                                                          isComplexTask,
                                                          selected
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
                modalContent={<AlarmPickerModal planItem={planItem}
                                                imageUriUpdate={updateImagePath}
                                                deleteImageUri={deleteImageUri}
                                                currentImageUri={imageUri}
                                                isComplexTask={isComplexTask}
                                                selected={selected}/>}
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