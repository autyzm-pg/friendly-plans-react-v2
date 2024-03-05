import React, { FC } from 'react';
import {StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';
import { IconProps } from 'react-native-elements';

import { dimensions, palette, typography } from '../styles';
import { Icon } from './Icon';
import { StyledText } from './StyledText';

interface Props extends IconProps {
    label?: string;
    iconButtonStyle?: StyleProp<ViewStyle>;
}

export const StudentSettingsButton: FC<Props> = ({ delayLongPress, onLongPress,
                                           onPress, containerStyle,
                                           label, disabled, iconButtonStyle, ...props }) => {
    return (
        <TouchableOpacity disabled={disabled} delayLongPress={delayLongPress}
                          onLongPress={onLongPress} onPress={onPress}
                          style={[styles.container, disabled ? {backgroundColor: palette.primaryDisabled} : [containerStyle, iconButtonStyle]]}>
            <View style={{marginRight: 10}}>
                <Icon {...props} color={palette.background} disabledStyle={styles.iconDisabled} />
            </View>
            {!!label && <View>
                <StyledText style={styles.label}>{label}</StyledText>
            </View>
            }
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    label: {
        ...typography.button,
        textAlign: 'center',
        color: palette.background,
        marginLeft: dimensions.spacingTiny,
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: palette.primaryVariant,
        height: '100%',
        paddingTop: 12,
        paddingBottom: 12,
        paddingRight: 20,
        paddingLeft: 20,
        borderRadius: 8,
    },
    iconDisabled: {
        backgroundColor: 'transparent',
    },
});

StudentSettingsButton.displayName = 'StudentSettingsButton';
