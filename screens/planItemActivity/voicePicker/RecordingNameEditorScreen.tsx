import React, { FC, useEffect, useState } from 'react';
import { TextInput } from '../../../components'
import { typography } from '../../../styles';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { i18n } from '../../../locale';
import { InnerGalleryService as InnerGallery, PlanItem } from '../../../models';
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

  useEffect(() => {
    let uri = route.params?.uri;
    uri = uri.substring(uri.lastIndexOf('/') + 1);
    if (uri.length >= 45) { uri = uri.slice(0, 45) + '...'; }
    setPlaceHolder(uri.substring(uri.lastIndexOf('/') + 1));
  }, []);

  const renameFile = async() => {
    if (!InnerGallery.validateFileName(text, setText)) { return; }
    const orgUri = route.params?.uri;
    const fileName = InnerGallery.getFileName(orgUri);
    const [_, extension] = InnerGallery.splitToNameAndExtension(fileName);
    const fileTargetPath = await InnerGallery.createUniqueFilePath(InnerGallery.recordingsDir, text + '.' + extension);
    const updateUri = async(filePath: string) => {
      await PlanItem.updateVoiceUri(orgUri, filePath).then(() => {
        navigation.navigate(Route.Dashboard);
      });
    };
    await InnerGallery.renameFile(orgUri, fileTargetPath, updateUri);
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