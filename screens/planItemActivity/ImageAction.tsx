import React, { FC } from 'react';

import { StyledText } from '../../components';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { palette, typography } from '../../styles';
import { Icon } from 'react-native-elements';

interface Props {
  buttonName: string;
  buttonType: string;
  title: string;
  onPress: any
}

export const ImageAction: FC<Props> = ({ buttonName, buttonType, title, onPress }) => (
    <View style={[styles.container, { flex: 1 }]}>
      <TouchableOpacity onPress={onPress} 
                        style={styles.container}
                        hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}>
        <View style={styles.icon}>
          <Icon
            name={buttonName} 
            type={buttonType} 
            size={24}
            color={palette.primary}
          />
        </View>
        <StyledText style={styles.title}>{title}</StyledText>
      </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderColor: palette.backgroundSurface,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.overline,
    width: 64,
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: 8,
  },
});
