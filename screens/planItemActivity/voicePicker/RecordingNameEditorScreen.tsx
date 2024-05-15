import React, { FC, useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions, Text } from 'react-native';
import { StyledText, IconButton, TextInput } from '../../../components'
import { palette, typography, dimensions, getElevation } from '../../../styles';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { i18n } from '../../../locale';
import RNFS from 'react-native-fs';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { PlanItem } from '../../../models';
import { Route } from '../../../navigation';

const { height: windowHeight } = Dimensions.get('window');

interface Props {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}

export const RecordingNameEditor: FC<Props> = ({ navigation, route }) => {
  const backgroundAnimation = useRef(new Animated.Value(0));
  const translateY = backgroundAnimation.current.interpolate({
    inputRange: [0, 1],
    outputRange: [windowHeight, 0],
  });

  const [text, setText] = useState('');
  const [placeHolder, setPlaceHolder] = useState('');
  const recordingsDir = RNFS.DocumentDirectoryPath + '/Recordings/';

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

  useEffect(() => {
    onOpen();
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

  const renameFile = async() => {
    const orgUri = route.params?.uri;
    const [_, extension] = splitToNameExtension(orgUri.substring(orgUri.lastIndexOf('/') + 1));
    const targetUri = 'file://' + recordingsDir + text + '.' + extension;
    const isValidText = /^[a-zA-Z0-9]+$/.test(text);
    if (!isValidText) {
      setText(i18n.t('recGallery:wrongName'));
      return; 
    }
    // console.log(orgUri);
    // console.log(targetUri);
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

  return (
      <Animated.View style={[styles.overlay]}>
        <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
          <View style={styles.modalInsideView}>
            <StyledText style={styles.modalTitle}>{i18n.t('recGallery:changeName')}</StyledText>
            <IconButton
              name='close'
              type='material'
              color={palette.textBody}
              onPress={goBack}
              iconButtonStyle={styles.closeModalIcon}
            />
            <View style={styles.inputContainer}>
              <TextInput
                style={{ marginTop: 20, marginBottom: 20, width: 380 }}
                textStyle={{...typography.subtitle, textAlign: 'left'}}
                placeholder={placeHolder}
                value={text}
                onChangeText={setText}
              />
              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => renameFile()}>
                <Text style={styles.modalTitle}>{i18n.t('recGallery:save')}</Text>
                <IconButton
                  name='check-circle'
                  type='font-awesome'
                  color={palette.primary}
                  size={24}
                  onPress={() => renameFile()}
                  style={{ marginLeft: dimensions.spacingSmall }}
                />
              </TouchableOpacity>
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
