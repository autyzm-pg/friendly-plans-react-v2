import {IconButton} from '../../../components';
import {i18n} from '../../../locale';
import {noop} from 'lodash';
import {PlanItem} from '../../../models';
import React, {FC, useEffect, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import DocumentPicker, {types} from 'react-native-document-picker';
import {dimensions} from '../../../styles';
import {ImageAction} from '../ImageAction';
import Tts from 'react-native-tts';
import Sound from 'react-native-sound';
import RNFS from 'react-native-fs';
import { NavigationProp } from '@react-navigation/native';
import {Route} from '../../../navigation';
import uuid from 'react-native-uuid';

interface Props {
  closeModal?: () => void;
  planItem: PlanItem;
  voiceUriUpdate: (imageUri: string) => void;
  deleteVoice: () => void;
  currentVoiceUri: string;
  setLector: () => void;
  isComplexTask: boolean;
  selected?: {
    key: number;
    voicePath: string;
    lector: boolean;
    name: string;
  };
  lector: boolean,
  navigation: NavigationProp<any>;
}

export const VoicePickerModal: FC<Props> = ({
                        closeModal = noop,
                        voiceUriUpdate, deleteVoice,
                        currentVoiceUri,
                        isComplexTask, selected,
                        setLector, lector,
                        planItem,
                        navigation
                      }) => {
  const recordingsDir = RNFS.DocumentDirectoryPath + '/Recordings/';
  const playerRef = useRef<any>(null);

  useEffect(() => {
    RNFS.exists(recordingsDir)
    .then((exists) => {
      if (exists) { return; }
      RNFS.mkdir(recordingsDir)
        .then(() => {
          // console.log('Created: ' + recordingsDir)
        })
        .catch((error) => {
          // console.error('Error creating: ' + recordingsDir, error);
        });
    })
    .catch((error) => {
      console.error('Cannot check if directory exists: ' + recordingsDir, error);
    });
    return () => {
      if (playerRef.current) {
        playerRef.current.stop();
        playerRef.current.release();
      }
    };
  }, []);

  const splitToNameExtension = (fileName: string) => {
    const idx = fileName.lastIndexOf('.');
    if (idx !== -1) {
      const name = fileName.substring(0, idx);
      const extension = fileName.substring(idx + 1);
      return [name, extension];
    }
    return fileName;
  };

  const openGallery = async () => {
    closeModal();
    const response = await DocumentPicker.pick({
      presentationStyle: 'fullScreen',
      type: types.audio,
      allowMultiSelection: false,
    });
    if (!response[0]) { return; }
    let fileTargetPath = recordingsDir + response[0].name;
    const doesFileExist = await RNFS.exists(fileTargetPath);
    if (doesFileExist && response[0].name) { 
      const [name, extension] = splitToNameExtension(response[0].name);
      fileTargetPath = recordingsDir + name + '_' + uuid.v4() + '.' + extension;
    }
    await RNFS.copyFile(response[0].uri, fileTargetPath)
    .then(() => {
      //console.log('Recording copied to: ' + fileTargetPath);
      voiceUriUpdate('file://' + fileTargetPath);
    })
    .catch((error) => {
      console.error('Error copying recording: ', error);
    });
  };

  const callSetLector = () => {
    closeModal();
    setLector();
  };

  const openLibrary = async () => {
    closeModal();
    navigation.navigate(Route.RecordingLibrary, { updateRecording: voiceUriUpdate });
  };

  const callDeleteVoice = async () => {
    closeModal();
    // console.log(currentVoiceUri);
    // if (currentVoiceUri && !isComplexTask) {
    //   await ImagePicker.cleanSingle(currentVoiceUri).catch(() => {});
    // } else if (selected!.voicePath && isComplexTask) {
    //   await ImagePicker.cleanSingle(selected!.voicePath).catch(() => {});
    // }
    deleteVoice();
  };

  const playAudio = async () => {
    // closeModal();
    if ((!isComplexTask && lector && planItem.nameForChild) || (isComplexTask && selected?.lector && selected?.name)) {
      await Tts.getInitStatus().then(() => {
        Tts.setDefaultLanguage(i18n.t('common:language'));
        Tts.speak((isComplexTask && selected) ? selected?.name : planItem.nameForChild);
      }, (err) => {
        if (err.code === 'no_engine') {
          Tts.requestInstallEngine();
        }
      });
    }
    else if (currentVoiceUri) {
      const fullVoicePath = currentVoiceUri
      .replace('file:///', '/')
      .split('%20').join(' ');
      playerRef.current = new Sound(fullVoicePath, Sound.MAIN_BUNDLE,
        (error) => {
          if(error) {
            // console.log('Cannot load soundtrack:', error);
          }
          else {
            playerRef.current.play((success:any) => {
              if(!success) {
                // console.log('Cannot play soundtrack.');
              }
              playerRef.current.release();
            });
          }
        });
    }
  };

  const recordVoice = () => {
    closeModal();
    navigation.navigate(Route.VoiceRecorder, { updateRecording: voiceUriUpdate });
  };

  return (
    <View style={styles.imageActionContainer}>
      {(currentVoiceUri || lector)
      ?
      <>
        <ImageAction title={i18n.t('planItemActivity:voiceActionDeleteVoice')} onPress={callDeleteVoice}>
          <IconButton 
            name='delete' 
            type='material' 
            size={24} 
            onPress={callDeleteVoice}
          />
        </ImageAction>
        <ImageAction title={i18n.t('planItemActivity:voiceActionPlayAudio')} onPress={playAudio}>
          <IconButton 
            name='speaker' 
            type='material' 
            size={24} 
            onPress={playAudio}
          />
        </ImageAction>
      </>
      :
      <></>
      }
      <ImageAction title={i18n.t('planItemActivity:useMicrophone')} onPress={() => { recordVoice() }}>
        <IconButton 
          name='microphone' 
          type='font-awesome' 
          size={24} 
          onPress={() => { recordVoice() }}
        />
      </ImageAction>
      <ImageAction title={i18n.t('planItemActivity:imageActionLibrary')} onPress={openLibrary}>
        <IconButton 
          name='library-music' 
          type='material' 
          size={24} 
          onPress={openLibrary}
        />
      </ImageAction>
      {!lector && <ImageAction title={i18n.t('planItemActivity:voiceActionSetLector')} onPress={callSetLector}>
        <IconButton 
          name='megaphone' 
          type='entypo' 
          size={24} 
          onPress={callSetLector}
        />
      </ImageAction>}
      <ImageAction title={i18n.t('planItemActivity:voiceActionAddRecord')} onPress={openGallery}>
        <IconButton 
          name='file-download' 
          type='material' 
          size={24} 
          onPress={openGallery}
        />
      </ImageAction>
    </View>
  );
};

const styles = StyleSheet.create({
  imageActionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: dimensions.spacingLarge,
  },
});