import React, { FC, useRef, useEffect, useState, } from 'react';
import { View, StyleSheet, PermissionsAndroid } from 'react-native';
import { StyledText, TextInput } from '../../../components'
import { typography, dimensions } from '../../../styles';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { i18n } from '../../../locale';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import uuid from 'react-native-uuid';
import { TextAction } from '../TextAction';
import { ModalTemplate } from '../../../components/ModalTemplate';

interface Props {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}

export const VoiceRecorder: FC<Props> = ({ navigation, route }) => {
  const checkForPermissions = async() => {
    const recordingPermition = PermissionsAndroid.PERMISSIONS.RECORD_AUDIO;
    const permission = await PermissionsAndroid.check(recordingPermition);
    if (permission) { return; }
    const grant = await PermissionsAndroid.request(recordingPermition);
    if (grant !== PermissionsAndroid.RESULTS.GRANTED) { navigation.goBack(); }
  };

  const audioRecorderPlayer = useRef(new AudioRecorderPlayer());
  const filePath = useRef<string>('');
  const [time, setTime] = useState<string>('00:00:00');
  const [duration, setDuration] = useState<string>('00:00:00');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const recording = useRef<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playing = useRef<boolean>(false);
  const [isRecorded, setIsRecorded] = useState<boolean>(false);
  const [text, setText] = useState<string>('');

  useEffect(() => {
    checkForPermissions();
    return () => {
        if (recording.current) { stopRecording(); }
        else if (playing.current) { stopPlaying(); }
    };
  }, []);

  const startRecording = async() => {
    setIsRecording(true);
    recording.current = true;
    filePath.current = await audioRecorderPlayer.current.startRecorder();
    audioRecorderPlayer.current.addRecordBackListener((e) => {
        setTime(audioRecorderPlayer.current.mmssss(Math.floor(e.currentPosition)));
        return;
    });
  };

  const stopRecording = async() => {
    await audioRecorderPlayer.current.stopRecorder();
    audioRecorderPlayer.current.removeRecordBackListener();
    setTime('00:00:00');
    setIsRecording(false);
    recording.current = false;
    setIsRecorded(true);
  };

  const startPlaying = async() => {
    setIsPlaying(true);
    playing.current = true;
    await audioRecorderPlayer.current.startPlayer();
    audioRecorderPlayer.current.addPlayBackListener((e) => {
        setDuration(audioRecorderPlayer.current.mmssss(Math.floor(e.duration)));
        setTime(audioRecorderPlayer.current.mmssss(Math.floor(e.currentPosition)));
        if (e.currentPosition >= e.duration) {
            audioRecorderPlayer.current.removePlayBackListener();
            setIsPlaying(false);
        }
        return;
    });
  };

  const stopPlaying = async() => {
    audioRecorderPlayer.current.stopPlayer();
    audioRecorderPlayer.current.removePlayBackListener();
    setIsPlaying(false);
    playing.current = false;
  };

  const recordingRender = () => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: dimensions.spacingBig }}>
            <StyledText style={styles.time}>{time}</StyledText>
            {!isRecording && 
                <TextAction onPress={startRecording}
                            title={i18n.t('voiceRecorder:startRecording')}
                            buttonName='circle'
                            buttonType='material'
                            />
            }
            {isRecording &&
                <TextAction onPress={stopRecording}
                            title={i18n.t('voiceRecorder:stopRecording')}
                            buttonName='pause'
                            buttonType='material'
                            />
            }
        </View>
    );
  };

  const playingRender = () => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: dimensions.spacingBig }}>
            <StyledText style={styles.time}>{time + ' / ' + duration}</StyledText>
            {!isPlaying &&
                <TextAction onPress={startPlaying}
                            title={i18n.t('voiceRecorder:startPlaying')}
                            buttonName='play-arrow'
                            buttonType='material'
                            />
            }
            {isPlaying &&
                <TextAction onPress={stopPlaying}
                            title={i18n.t('voiceRecorder:stopPlaying')}
                            buttonName='pause'
                            buttonType='material'
                            />
            }
        </View>
    );
  };

  const validate = () => {
    const isValidText = /^[a-zA-Z0-9]+$/.test(text);
    if (text.length == 0) {
      setText(i18n.t('common:required'));
      return false;
    }
    else if (!isValidText) {
      setText(i18n.t('common:incorrectFileName'));
      return false;
    }
    return true;
  };

  const saveRecording = async() => {
    if(!validate()) { return; }
    const imagesDir = RNFS.DocumentDirectoryPath + '/Recordings/';
    let fileTargetPath = 'file://' + imagesDir + text + '.mp4';
    const doesFileExist = await RNFS.exists(fileTargetPath);
    if (doesFileExist) {
        fileTargetPath = 'file://' + imagesDir + text + '_' + uuid.v4() + '.mp4';
    }
    await RNFS.copyFile(filePath.current, fileTargetPath)
    .then(() => {
        // console.log('Image copied to: ' + fileTargetPath);
        route.params?.updateRecording('file://' + fileTargetPath);
        navigation.goBack();
    })
    .catch((error) => {
        console.error('Error copying image: ', error);
    });
  };

  const saveOrDiscardView = () => {
    return (
        <>
            <TextInput
                style={{ marginTop: 20, marginBottom: 20, width: 380 }}
                textStyle={{...typography.subtitle, textAlign: 'center'}}
                placeholder={i18n.t('voiceRecorder:fileName')}
                value={text}
                onChangeText={setText}
              />
            <TextAction onPress={saveRecording}
                        title={i18n.t('voiceRecorder:save')}
                        buttonName='check-circle'
                        buttonType='font-awesome'
                        />
        </>
    );
  };

  const render = () => {
    return (
      <>
        {isRecorded 
          ? (
              <>
              {playingRender()}
              {saveOrDiscardView()}
              </>
          ) : (
              recordingRender()
          )
        }
      </>
    );
  };

  return (<ModalTemplate navigation={navigation} title={i18n.t('voiceRecorder:title')} children={render()}/>);
};

const styles = StyleSheet.create({
  time: {
    ...typography.headline3, 
    marginRight: dimensions.spacingSmall,
    paddingBottom: 5
  }
});
