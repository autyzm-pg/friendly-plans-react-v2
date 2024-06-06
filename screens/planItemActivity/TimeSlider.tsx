import React, { FC, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Slider } from '../../components';
import { i18n } from '../../locale';
import { palette } from '../../styles';

interface Props {
  min: number[];
  max: number[];
  savedTime: number;
  closeModal?: () => void;
  onConfirm?: (time: number) => void;
}

export const TimeSlider: FC<Props> = ({ min, max, closeModal, onConfirm,
                                         savedTime}) => {

  const initHours = Math.floor(savedTime / 3600);
  const initMinutes = Math.floor((savedTime - initHours*3600) / 60);
  const initSeconds = savedTime - initMinutes*60 - initHours*3600;

  const [seconds, setSeconds] = useState(initSeconds);
  const [minutes, setMinutes] = useState(initMinutes);
  const [hours, setHours] = useState(initHours);

  useEffect(() => {}, [seconds, minutes, hours]);
  
  const handleConfirmPressed = () => {
    if (onConfirm) {
      onConfirm(seconds + minutes*60 + hours*3600);
    }
    if (closeModal) {
      closeModal();
    }
  };

  return (
    <View style={{marginTop: 20}}>
      <Slider title={i18n.t('planItemActivity:timerHours')} 
              min={min[0]} max={max[0]} handleSliding={setHours} initValue={hours} />

      <Slider title={i18n.t('planItemActivity:timerMinutes')} 
              min={min[1]} max={max[1]} handleSliding={setMinutes} initValue={minutes} />

      <Slider title={i18n.t('planItemActivity:timerSeconds')} 
              min={min[2]} max={max[2]} handleSliding={setSeconds} initValue={seconds} />
      <View style={styles.timeSlider}>
        <TouchableOpacity onPress={closeModal}>
          <Text>{i18n.t('common:cancel')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleConfirmPressed}>
          <Text style={styles.confirmButton}>{i18n.t('common:confirm')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  timeSlider: { flexDirection: 'row', alignSelf: 'flex-end' },
  confirmButton: { color: palette.textBody, marginLeft: 8 },
  image: {
    width: 200,
    height: 200,
  },
});
