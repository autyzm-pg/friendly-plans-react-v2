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
import { NavigationProp } from '@react-navigation/native';
import {Route} from '../../../navigation';
import { InnerGallery } from '../../../models/InnerGallery';

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
  const playerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (!playerRef.current) { return; }
      playerRef.current.stop();
      playerRef.current.release();
    };
  }, []);

  const openGallery = async () => {
    closeModal();
    const response = await DocumentPicker.pick({
      presentationStyle: 'fullScreen',
      type: types.audio,
      allowMultiSelection: false,
    });
    if (!response[0] || !response[0].name) { return; }
    const fileTarPath = await InnerGallery.createUniqueFilePath(InnerGallery.recordingsDir, response[0].name);
    InnerGallery.copyFile(response[0].uri, fileTarPath, voiceUriUpdate);
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
        <ImageAction title={i18n.t('planItemActivity:voiceActionDeleteVoice')} 
                     onPress={callDeleteVoice}
                     buttonName='delete'
                     buttonType='material'
                     />
        <ImageAction title={i18n.t('planItemActivity:voiceActionPlayAudio')} 
                     onPress={playAudio}
                     buttonName='speaker'
                     buttonType='material'
                     />
      </>
      :
      <></>
      }
      <ImageAction title={i18n.t('planItemActivity:useMicrophone')} 
                   onPress={recordVoice}
                   buttonName='microphone'
                   buttonType='font-awesome'
                   />
      <ImageAction title={i18n.t('planItemActivity:imageActionLibrary')} 
                   onPress={openLibrary}
                   buttonName='library-music'
                   buttonType='material'
                   />
      {!lector && 
      <ImageAction title={i18n.t('planItemActivity:voiceActionSetLector')}
                   onPress={callSetLector}
                   buttonName='megaphone'
                   buttonType='entypo'
                   />
      }
      <ImageAction title={i18n.t('planItemActivity:voiceActionAddRecord')} 
                   onPress={openGallery}
                   buttonName='file-download'
                   buttonType='material'
                   />
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