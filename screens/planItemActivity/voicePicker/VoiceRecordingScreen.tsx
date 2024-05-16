import React, { FC, useRef, useEffect, useState, } from 'react';
import { View, StyleSheet, Animated, Dimensions, TouchableOpacity, Text, PermissionsAndroid } from 'react-native';
import { StyledText, IconButton, TextInput } from '../../../components'
import { palette, typography, dimensions, getElevation } from '../../../styles';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { i18n } from '../../../locale';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import uuid from 'react-native-uuid';

const { height: windowHeight } = Dimensions.get('window');

interface Props {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}

export const VoiceRecorder: FC<Props> = ({ navigation, route }) => {
  const backgroundAnimation = useRef(new Animated.Value(0));
  const translateY = backgroundAnimation.current.interpolate({
    inputRange: [0, 1],
    outputRange: [windowHeight, 0],
  });

  const onOpen = () => {
    Animated.timing(backgroundAnimation.current, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const goBack = () => {
    Animated.timing(backgroundAnimation.current, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setTimeout(() => navigation.goBack(), 200);
  };

  const checkForPermissions = async() => {
    const recordingPermition = PermissionsAndroid.PERMISSIONS.RECORD_AUDIO;
    const permission = await PermissionsAndroid.check(recordingPermition);
    if (permission) { return; }
    const grant = await PermissionsAndroid.request(recordingPermition);
    if (grant !== PermissionsAndroid.RESULTS.GRANTED) { goBack(); }
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
    onOpen();
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
            <StyledText style={{...typography.headline3}}>{time}</StyledText>
            {!isRecording && 
                <IconButton
                    name='circle'
                    type='material'
                    color={palette.textBody}
                    onPress={startRecording}
                    size={24}
                    style={{ marginLeft: dimensions.spacingSmall}}
                />}
            {isRecording &&
                <IconButton
                    name='pause'
                    type='material'
                    color={palette.textBody}
                    onPress={stopRecording}
                    size={24}
                    style={{ marginLeft: dimensions.spacingSmall}}
                />}
        </View>
    );
  };

  const playingRender = () => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: dimensions.spacingBig }}>
            <StyledText style={{...typography.headline3}}>{time + ' / ' + duration}</StyledText>
            {!isPlaying &&
                <IconButton
                name='play-arrow'
                type='material'
                color={palette.textBody}
                onPress={startPlaying}
                size={24}
                style={{ marginLeft: dimensions.spacingSmall}}
                />}
            {isPlaying &&
                <IconButton
                name='pause'
                type='material'
                color={palette.textBody}
                onPress={stopPlaying}
                size={24}
                style={{ marginLeft: dimensions.spacingSmall}}
                />}
        </View>
    );
  };

  const saveRecording = async() => {
    if(!text) { return; }
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
        goBack();
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
            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={saveRecording}>
                <Text style={styles.modalTitle}>{i18n.t('voiceRecorder:save')}</Text>
                <IconButton
                  name='check-circle'
                  type='font-awesome'
                  color={palette.primary}
                  size={24}
                  onPress={saveRecording}
                  style={{ marginLeft: dimensions.spacingSmall }}
                />
            </TouchableOpacity>
        </>
    );
  };

  return (
      <Animated.View style={[styles.overlay]}>
        <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
          <View style={styles.modalInsideView}>
            <StyledText style={styles.modalTitle}>{i18n.t('voiceRecorder:title')}</StyledText>
            <IconButton
              name='close'
              type='material'
              color={palette.textBody}
              onPress={goBack}
              iconButtonStyle={styles.closeModalIcon}
            />
            <View style={styles.inputContainer}>
                {isRecorded 
                ? (
                    <>
                    {playingRender()}
                    {saveOrDiscardView()}
                    </>
                ) : (
                    recordingRender()
                )}
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.modalBackgroundOverlay,
  },
  container: {
    ...getElevation(4),
    width: 438,
    height: '20%',
  },
  modalInsideView: {
    ...getElevation(4),
    backgroundColor: palette.background,
    width: 438,
    borderRadius: 16,
    paddingVertical: dimensions.spacingBig,
    paddingHorizontal: dimensions.spacingLarge,
  },
  closeModalIcon: {
    position: 'absolute',
    top: dimensions.spacingBig,
    right: dimensions.spacingLarge,
  },
  modalTitle: {
    ...typography.subtitle,
    color: palette.textBody,
  },
  inputContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
});
