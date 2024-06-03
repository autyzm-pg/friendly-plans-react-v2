import { NavigationProp, RouteProp } from '@react-navigation/native';
import React, { FC, useEffect, useState } from 'react';
import { ModalTemplate, StyledText } from '../../components';
import { i18n } from '../../locale';
import { TextAction } from '../planItemActivity/TextAction';
import { zip, subscribe } from 'react-native-zip-archive';
import {InnerGalleryService as InnerGallery} from '../../services/InnerGalleryService';
import { dimensions, fonts, palette, typography } from '../../styles';
import { StyleSheet, View } from 'react-native';

interface Props {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
};

export const ExportScreen: FC<Props> = ({ navigation, route }) => {
  const [exportProgress, setExportProgress] = useState<string>('0');
  const [size, setSize] = useState<string>(' ');

  const [exporting, setExporting] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);

  useEffect(() => {
    const setDirSize = async() => {
      const dirSize = route.params?.images ? 
      await InnerGallery.getGallerySize(InnerGallery.imagesDir)
      :
      await InnerGallery.getGallerySize(InnerGallery.recordingsDir);
      setSize(dirSize);
    };
    setDirSize();
  }, []);

  const exportAll = async() => {
    setExporting(true);
    const sub = subscribe(({ progress }) => { setExportProgress((progress*100).toFixed(0)); console.log(progress); });
    if (route.params?.images) {
      await zip(InnerGallery.imagesDir, InnerGallery.exportImgPath);
    } else {
      await zip(InnerGallery.recordingsDir, InnerGallery.exportRecPath);
    }
    sub.remove();
    setExporting(false);
    setFinished(true);
  };

  const render = () => {
    return (
      <>
        <View style={{ marginTop: dimensions.spacingSmall }}></View>
        <StyledText style={styles.modalTitle}>{i18n.t('export:info', { size: size })}</StyledText>
        {exporting && 
        <>
          <View style={{ marginTop: dimensions.spacingSmall }}></View>
          <StyledText style={styles.time}>{i18n.t('export:progress') + ' ' + exportProgress + '%'}</StyledText>
        </>}
        <View style={{ marginTop: dimensions.spacingSmall }}></View>
        {!exporting && !finished &&
        <TextAction onPress={exportAll} 
                    title={i18n.t('common:export')}
                    buttonName='check-circle'
                    buttonType='font-awesome'
                    />}
        {!exporting && finished && 
        <TextAction onPress={navigation.goBack} 
                    title={i18n.t('export:ready')}
                    buttonName='check-circle'
                    buttonType='font-awesome'
                    />}
      </>
    );
  };

  return (<ModalTemplate navigation={navigation} 
                         title={route.params?.images ? i18n.t('export:titleImg') : i18n.t('export:titleRec')} 
                         children={render()}/>);
};

const styles = StyleSheet.create({
  time: {
    fontFamily: fonts.sansSerif.regular,
    fontSize: typography.subtitle.fontSize,
    letterSpacing: 0, 
    marginRight: dimensions.spacingSmall,
    paddingBottom: 5
  },
  modalTitle: {
    ...typography.subtitle,
    color: palette.textBody,
  },
});
