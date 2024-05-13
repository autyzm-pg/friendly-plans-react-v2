import React, { FC, useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { StyledText, IconButton, TextInput } from '../../../components'
import { palette, typography, dimensions, getElevation } from '../../../styles';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { i18n } from '../../../locale';

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
    if (uri.length >= 35) { uri = uri.slice(0, 35) + '...'; }
    setPlaceHolder(uri.substring(uri.lastIndexOf('/') + 1));
  }, []);

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
            <TextInput
              style={{marginTop: 20, marginBottom: 35, width: 300,}}
              textStyle={{...typography.subtitle, textAlign: 'left',}}
              placeholder={placeHolder}
              value={text}
              onChangeText={setText}
            />
          </View>
        </Animated.View>
      </Animated.View>
      )
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
});
