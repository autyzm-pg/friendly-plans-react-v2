import {i18n} from '../../../locale';
import {noop} from 'lodash';
import {PlanItem} from '../../../models';
import React, {FC, useEffect, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import DocumentPicker, {types} from 'react-native-document-picker';
import {dimensions} from '../../../styles';
import {ImageAction} from '../ImageAction';
import Sound from 'react-native-sound';
import {NavigationProp} from '@react-navigation/native';
import {Route} from '../../../navigation';
import {InnerGalleryService as InnerGallery} from '../../../services/InnerGalleryService';
import {SoundService} from '../../../services/SoundService';
import { FormikProps } from 'formik';
import { PlanItemFormData } from '../PlanItemForm';

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
    name?: string;
  };
  formikProps: FormikProps<PlanItemFormData>;
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
                        navigation,
                        formikProps
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
    if ((!isComplexTask && lector && formikProps.values.name) || (isComplexTask && selected?.lector && selected?.name)) {
      const text = (isComplexTask && selected && selected.name) ? selected?.name : formikProps.values.name;
      if (!text) { return; }
      await SoundService.lectorSpeak(text);
    }
    else if (currentVoiceUri) {
      const fullVoicePath = currentVoiceUri
      .replace('file:///', '/')
      .split('%20').join(' ');
      playerRef.current = new Sound(fullVoicePath, Sound.MAIN_BUNDLE,
        (error) => {
          if(error) {
            console.error('Cannot load soundtrack:', error);
          }
          else {
            playerRef.current.play((success:any) => {
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