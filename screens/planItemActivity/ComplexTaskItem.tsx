import React, {FC, useEffect, useState} from 'react';
import {StyleSheet, TouchableHighlight, View} from 'react-native';

import {Card, IconButton, StyledText} from '../../components';
import {Image} from 'react-native-elements';
import {i18n} from '../../locale';
import {dimensions, palette, typography} from '../../styles';

interface Props {
    name: string;
    image: string;
    initialTime: number;
    selected: boolean;
    onDelete: () => void;
    onSelectChange: () => void;
}


export const ComplexTaskItem: FC<Props> = ({
                                                              name, image, initialTime,
                                                              selected,
                                                              onDelete, onSelectChange
                                                          }) => {

    const hours = Math.floor(initialTime / 3600);
    const minutes = Math.floor((initialTime - hours * 3600) / 60);
    const seconds = initialTime - minutes * 60 - hours * 3600;

    const [timeAmount, setTime] = useState(hours + ':' + minutes + ':' + seconds);

    useEffect(() => {
        setTime(hours + ':' + minutes + ':' + seconds);
    });

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <View style={[styles.leftContainer, selected && styles.backgroundPrimary]}>
                    <IconButton
                        type="material"
                        name="visibility"
                        size={24}
                        color={selected ? palette.textWhite : palette.primary}
                    />
                    <IconButton type="material" name="delete" size={24} color={selected ? palette.textWhite : palette.primary}
                                onPress={onDelete}/>
                </View>
                <TouchableHighlight underlayColor={'none'} style={styles.rightContainer} onPress={onSelectChange}>
                    <View>
                        <View style={styles.timeContainer}>
                            <View>
                                <IconButton
                                    name={initialTime > 0 ? 'timer' : 'alarm-off'}
                                    type="material"
                                    label={initialTime > 0 ? timeAmount : ''}
                                    containerStyle={styles.iconButtonContainer}
                                    size={24}
                                    color={palette.primaryVariant}
                                    disabled
                                />
                            </View>
                        </View>
                        <View style={styles.taskContainer}>
                            {image ? (
                                <Image source={{uri: image}} style={styles.image}/>
                            ) : (
                                <StyledText>{i18n.t('planItemActivity:complexTaskPhotoPlaceholder')}</StyledText>
                            )}
                            <StyledText style={styles.name}>{name}</StyledText>
                        </View>
                    </View>
                </TouchableHighlight>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        width: 50,
        height: 50,
    },
    container: {
        marginHorizontal: 3,
        marginTop: 3,
        marginBottom: dimensions.spacingMedium,
    },
    card: {
        flexDirection: 'row',
        width: '100%',
        paddingVertical: 0,
        paddingHorizontal: 0,
        height: 144,
    },
    leftContainer: {
        justifyContent: 'space-between',
        height: '100%',
        borderBottomLeftRadius: dimensions.spacingSmall,
        borderTopLeftRadius: dimensions.spacingSmall,
        backgroundColor: palette.backgroundAdditional,
        paddingVertical: dimensions.spacingMedium,
        paddingHorizontal: dimensions.spacingSmall,
    },
    rightContainer: {
        flex: 1,
        justifyContent: 'space-between',
        paddingTop: dimensions.spacingMedium,
        paddingBottom: dimensions.spacingBig,
        paddingRight: dimensions.spacingMedium,
    },
    timeContainer: {
        alignItems: 'flex-end',
    },
    taskContainer: {
        alignItems: 'center',
    },
    time: {
        ...typography.headline6,
        color: palette.textInputPlaceholder,
    },
    name: {
        ...typography.headline6,
        color: palette.textBody,
        marginTop: dimensions.spacingBig,
    },
    backgroundPrimary: {
        backgroundColor: palette.primary,
    },
    imageInputText: {
        ...typography.taskInput,
        textAlign: 'center',
    },
    iconButtonContainer: {
        backgroundColor: palette.backgroundAdditional,
        paddingVertical: 4,
        paddingHorizontal: dimensions.spacingSmall,
        borderRadius: 8,
    },
});
