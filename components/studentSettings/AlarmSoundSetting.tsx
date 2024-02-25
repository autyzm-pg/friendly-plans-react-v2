import {IconButton, StyledText} from 'components';
import {i18n} from 'locale';
import {assignIn} from 'lodash';
import React, {SFC} from 'react';
import {StyleSheet, View} from 'react-native';
import {dimensions, palette, typography} from '../styles';

interface Props {
    value: string;
    onChange?: (value: boolean) => void;
    available: boolean;
}

export const AlarmSoundSetting: SFC<Props> = ({value, onChange, available}) => (
    <View style={styles.container}>
        <StyledText style={styles.label}>
            {i18n.t('studentSettings:alarmSound')} {!available ? i18n.t('studentSettings:workInProgress') : ''}
        </StyledText>
        <View style={styles.soundPickerContainer}>
            <StyledText style={[styles.soundPicker, !available && {color: palette.shuffleTaskDisabled}]}>{value}</StyledText>
            <IconButton disabled={!available} name="chevron-right" type="material" size={30} color={!available ? palette.shuffleTaskDisabled : palette.textDisabled}/>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: dimensions.spacingMedium,
        height: 40,
    },
    label: {
        ...typography.subtitle,
        color: palette.textBody,
    },
    soundPicker: {
        ...typography.overline,
        color: palette.textDisabled,
        marginRight: dimensions.spacingBig,
    },
    soundPickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
