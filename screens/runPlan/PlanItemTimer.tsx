import React, { FC, useRef, useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, StyledText } from '../../components';

import Sound from 'react-native-sound';
import sounds from '../../assets/sounds/sounds';

import { useCurrentStudentContext } from '../../contexts/CurrentStudentContext';

interface Props {
  itemTime: number;
}

export const PlanItemTimer: FC<Props> = ({ itemTime }) => {
  const { currentStudent } = useCurrentStudentContext();

  const timerID = useRef<any>(null);
  const soundTrack = useRef<any>(null);

  const [time, setTime] = useState<number>(itemTime);
  
  const pause = useRef<boolean>(false);
  const timer = useRef<number>(itemTime);

  const hours = () => Math.floor(time / 3600);
  const minutes = () => Math.floor((time - hours()*3600) / 60);
  const seconds = () => time - minutes()*60 - hours()*3600;
  const currentTime = () => hours() + ':' + minutes() + ':' + seconds();

  const resetTimer = () => {
    clearInterval(timerID.current);
    timerID.current = null;
  };

  useEffect(() => {
    setTime(itemTime);
    timer.current = itemTime;
    pause.current = false;
    resetTimer();
  }, [itemTime]);

  useEffect(() => {
    soundTrack.current = new Sound(currentStudent ? currentStudent.timer : sounds.default, Sound.MAIN_BUNDLE);
    return () => {
      resetTimer();
      soundTrack.current.stop();
      soundTrack.current.release();
    };
  }, []);

  const playAlarmInLoop = () => {
    soundTrack.current.play((success: boolean) => {
      if (success) { playAlarmInLoop(); }
    });
  };

  const tick = () => {
    if (pause.current) { return; }
    else if (timer.current > 0) { 
      setTime((prevTime) => {
        timer.current = prevTime - 1;
        return prevTime - 1;
      });
    }
    else {
      playAlarmInLoop();
      resetTimer();
    }
  };

  const onAlarmPress = () => {
    if (time == itemTime) {
      timerID.current = setInterval(() => tick(), 1000);
    } else if (0 < time) {
      pause.current = !pause.current;
    } else {
      soundTrack.current.stop();
      setTime(itemTime);
      timer.current = itemTime;
    }
  };

  const onAlarmLongPress = () => {
    soundTrack.current.stop();
    setTime(itemTime);
    timer.current = itemTime;
    pause.current = false;
    resetTimer();
  };

  return (
    <View style={styles.timeContainer}>
      <Icon onPress={onAlarmPress} onLongPress={onAlarmLongPress} name="timer" size={64} />
      <StyledText style={styles.timeText}>{currentTime()}</StyledText>
    </View>
  );
}

const styles = StyleSheet.create({
  timeContainer: {
    flex: 1,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 32,
  },
});
