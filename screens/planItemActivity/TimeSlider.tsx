import React, { FC, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
  const handleSlidingSec = (time: number) => setSeconds(time);
  const handleSlidingMin = (time: number) => setMinutes(time);
  const handleSlidingHour = (time: number) => setHours(time);
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
      <Slider min={min[0]} max={max[0]} handleSliding={handleSlidingHour} initValue={initHours} />
      <Text style={styles.time}>{i18n.t('planItemActivity:timerHours')}: {hours}</Text>

      <Slider min={min[1]} max={max[1]} handleSliding={handleSlidingMin} initValue={initMinutes} />
      <Text style={styles.time}>{i18n.t('planItemActivity:timerMinutes')}: {minutes}</Text>

      <Slider min={min[2]} max={max[2]} handleSliding={handleSlidingSec} initValue={initSeconds} />
      <Text style={styles.time}>{i18n.t('planItemActivity:timerSeconds')}: {seconds}</Text>
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
  time: {
      alignSelf: 'center',
      marginBottom: 20,
  },
});
