import {IconButton, StyledText} from '../../components';
import {i18n} from '../../locale';
import React, {FC, useEffect, useRef, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {dimensions, palette, typography} from '../../styles';
import sounds from '../../assets/sounds/sounds';
import Sound from 'react-native-sound';

interface Props {
    sound: string;
    onValueChange: (timer: string) => void;
}

export const AlarmSoundSetting: FC<Props> = ({sound, onValueChange}) => {
    const soundTrack = useRef<any>(null);
    const isPlaying = useRef(false);

    useEffect(() => {
        return () => {
            if(soundTrack.current) {
                soundTrack.current.stop();
                soundTrack.current.release();
            }
        };
      }, []);

    const items = useRef(Object.entries(sounds).map(([key, value]) => ({
        key: value,
        label: i18n.t(`timerSounds:${key}`),
        value: key,
    })));
    
    const initialTimerIndex = items.current.findIndex(item => item.value === sound);
    const [timerIndex, setTimerIndex] = useState(initialTimerIndex !== -1 ? initialTimerIndex : 0);

    const getLabel = () => {
        return items.current[timerIndex].label;
    };

    const handleChangeTimer = (direction: 'next' | 'prev') => {
        if (isPlaying && soundTrack.current) {
            soundTrack.current.stop();
            soundTrack.current.release();
            isPlaying.current = false;
        }
        if (direction === 'next') {
            setTimerIndex((prevIndex) => {
                const newIdx = (prevIndex + 1) % items.current.length;
                onValueChange(items.current[newIdx].key);
                return newIdx;
            });
        } else {
            setTimerIndex((prevIndex) => {
                const newIdx = (prevIndex - 1 + items.current.length) % items.current.length;
                onValueChange(items.current[newIdx].key);
                return newIdx;
            });
        }
    };

    const playAlarm = () => {
        if (isPlaying.current) { return; }
        soundTrack.current = new Sound(items.current[timerIndex].key, Sound.MAIN_BUNDLE, (error) => {
            if (error) { /*console.log('Failed to load timer asset:', error);*/ return; }
            isPlaying.current = true;
            soundTrack.current.play((success: boolean) => {
                if (success) {
                    soundTrack.current.stop();
                    soundTrack.current.release();
                }
                isPlaying.current = false;
            });
        });
    };

    return (
    <View style={styles.container}>
        <StyledText style={styles.label}>
            {i18n.t('studentSettings:alarmSound')}
        </StyledText>
        <View style={styles.soundPickerContainer}>
            <TouchableOpacity onPress={playAlarm} hitSlop={{ top: 25, bottom: 25, left: 25}}>
                <StyledText style={styles.soundPicker}>{`${getLabel()}`}</StyledText>
            </TouchableOpacity>
            {/* <IconButton name='chevron-left' type='material' size={36} color={palette.textDisabled} onPress={() => handleChangeTimer('prev')}/> */}
            <IconButton name='chevron-right' type='material' size={36} color={palette.textDisabled} onPress={() => handleChangeTimer('next')} hitSlop={{ top: 25, bottom: 25, left: 25}}/>
        </View>
    </View>
    );
};

const styles = StyleSheet.create({
    dropdowntext: {
        ...typography.body,
        color: palette.textBody
    },
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
