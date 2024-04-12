import React, { useState, FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconProps } from 'react-native-elements';
import { Slider } from '@rneui/themed';

import { dimensions, palette, typography } from '../styles';
import { Icon } from './Icon';
import { StyledText } from './StyledText';

interface Option {
  value: string;
  label: string;
}

interface Props {
  options: Option[];
  value: string;
  onSlidingComplete: (value: any) => void;
  iconLeft?: IconProps;
  iconRight?: IconProps;
}

export const FixedValueSlider: FC<Props> = ({options, value, onSlidingComplete, iconLeft, iconRight}) => {
  const [index, setIndex] = useState(options.findIndex(option => option.value === value));

  const handleSlidingComplete = (idx: number) => {
    onSlidingComplete(options[idx].value);
  };

  return (
    <View style={styles.container}>
      <StyledText style={styles.label}>{options[index].label}</StyledText>
      <View style={styles.sliderContainer}>
        {!!iconLeft && (
          <View style={styles.iconContainer}>
            <Icon size={32} color={palette.primary} {...iconLeft} />
          </View>
        )}
        <View style={styles.sliderInnerContainer}>
          <View style={styles.pointsContainer}>
            {options.map((_, idx) => (
              <View key={idx} style={[styles.point, idx === index && styles.pointSelected]} />
            ))}
          </View>
          <Slider
            allowTouchTrack
            minimumValue={0}
            maximumValue={options.length - 1}
            step={1}
            onSlidingComplete={handleSlidingComplete}
            onValueChange={setIndex}
            value={index}
            style={styles.slider}
            trackStyle={styles.sliderTrack}
            thumbStyle={styles.sliderThumb}
            maximumTrackTintColor="transparent"
            minimumTrackTintColor="transparent"
          />
        </View>
        {!!iconRight && (
          <View style={styles.iconContainer}>
            <Icon size={24} color={palette.primary} {...iconRight} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: dimensions.spacingBig,
  },
  label: {
    ...typography.caption,
    color: palette.settingsLabels,
    marginBottom: dimensions.spacingMedium,
    textAlign: 'center',
  },
  sliderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderInnerContainer: {
    borderRadius: dimensions.spacingBig,
    height: 40,
    marginHorizontal: dimensions.spacingBig,
    backgroundColor: palette.sliderBackground,
    flex: 1,
  },
  slider: {
    flex: 1,
  },
  sliderTrack: {
    height: 40,
    borderRadius: dimensions.spacingBig,
  },
  sliderThumb: {
    width: 40,
    height: 40,
    borderRadius: dimensions.spacingBig,
    backgroundColor: palette.primary,
  },
  pointsContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  point: {
    zIndex: 10,
    width: dimensions.spacingTiny,
    height: dimensions.spacingTiny,
    borderRadius: 3,
    margin: 17,
    backgroundColor: palette.primary,
  },
  pointSelected: {
    backgroundColor: palette.background,
  },
  iconContainer: {
    opacity: 0.4,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
