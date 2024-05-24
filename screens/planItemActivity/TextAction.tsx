import React, { FC } from 'react';

import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { dimensions, palette, typography } from '../../styles';
import { Icon } from 'react-native-elements';

interface Props {
  buttonName: string;
  buttonType: string;
  title: string;
  onPress: any
}

export const TextAction: FC<Props> = ({ buttonName, buttonType, title, onPress }) => (
    <TouchableOpacity style={{ flexDirection: 'row' }} onPress={onPress}>
        <Text style={{ ...typography.subtitle, color: palette.textBody }}>{title}</Text>
        <Icon
        name={buttonName}
        type={buttonType}
        color={palette.primary}
        size={24}
        style={{ marginLeft: dimensions.spacingSmall }}
        />
  </TouchableOpacity>
);
