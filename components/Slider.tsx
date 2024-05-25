import React, { FC } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { default as SliderRN } from '@react-native-community/slider'; // tslint:disable-line
import { palette } from '../styles';

interface Props {
  title: string;
  min: number;
  max: number;
  initValue: number;
  handleSliding: React.Dispatch<React.SetStateAction<number>>;
}

export const Slider: FC<Props> = ({ title, min, max, handleSliding, initValue }) => {

  const increment = () => {
    handleSliding((prevValue) => {
      if (prevValue + 1 > max) { return prevValue; }
      return prevValue + 1;
    });
  };

  const decrement = () => {
    handleSliding((prevValue) => {
      if (prevValue - 1 < min) { return prevValue; }
      return prevValue - 1;
    });
  };
  
  return (
    <>
    <View style={styles.sliderContainer}>
      <TouchableOpacity onPress={decrement} style={styles.button} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text>-</Text>
      </TouchableOpacity>
      <Text>{min}</Text>
      <SliderRN
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        onValueChange={handleSliding}
        step={1}
        value={initValue}
      />
      <Text>{max}</Text>
      <TouchableOpacity onPress={increment} style={styles.button} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Text>+</Text>
      </TouchableOpacity>
    </View>
    <Text style={styles.time}>{title}: {initValue}</Text>
    </>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slider: {
    width: '70%',
    height: 40,
  },
  button: {
    padding: 15,
    backgroundColor: palette.border,
    borderRadius: 5,
  },
  time: {
    alignSelf: 'center',
    marginBottom: 20,
  },
});
