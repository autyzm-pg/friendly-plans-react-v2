import React, { FC, useEffect, useState } from 'react';
import { TextInput } from '../../../components'
import { typography } from '../../../styles';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { i18n } from '../../../locale';
import RNFS from 'react-native-fs';
import { PlanItem } from '../../../models';
import { Route } from '../../../navigation';
import { TextAction } from '../TextAction';
import { ModalTemplate } from '../../../components/ModalTemplate';

interface Props {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}

export const RecordingNameEditor: FC<Props> = ({ navigation, route }) => {
  const [text, setText] = useState('');
  const [placeHolder, setPlaceHolder] = useState('');
  const recordingsDir = RNFS.DocumentDirectoryPath + '/Recordings/';

  useEffect(() => {
    let uri = route.params?.uri;
    uri = uri.substring(uri.lastIndexOf('/') + 1);
    if (uri.length >= 45) { uri = uri.slice(0, 45) + '...'; }
    setPlaceHolder(uri.substring(uri.lastIndexOf('/') + 1));
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

  const renameFile = async() => {
    const orgUri = route.params?.uri;
    const [_, extension] = splitToNameExtension(orgUri.substring(orgUri.lastIndexOf('/') + 1));
    const targetUri = 'file://' + recordingsDir + text + '.' + extension;
    if(!validate()) { return; }
    await RNFS.copyFile(orgUri, targetUri)
    .then(async() => {
      await RNFS.unlink(orgUri).then(async() => {
        await PlanItem.updateVoiceUri(orgUri, targetUri).then(() => {
          navigation.navigate(Route.Dashboard);
        });
      });
    })
    .catch((error) => {
      console.error('Error copying recording: ', error);
    });
  };

  const render = () => {
    return (
      <>
        <TextInput
                style={{ marginTop: 20, marginBottom: 20, width: 380 }}
                textStyle={{...typography.subtitle, textAlign: 'left'}}
                placeholder={placeHolder}
                value={text}
                onChangeText={setText}
              />
        <TextAction onPress={renameFile} 
                    title={i18n.t('recGallery:save')}
                    buttonName='check-circle'
                    buttonType='font-awesome'
                    />
      </>
    );
  };

  return (<ModalTemplate navigation={navigation} title={i18n.t('recGallery:changeName')} children={render()}/>);
};