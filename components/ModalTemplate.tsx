import React, { FC, ReactElement, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { StyledText, IconButton } from '../components'
import { palette, typography, dimensions, getElevation } from '../styles';
import { NavigationProp } from '@react-navigation/native';
import { i18n } from '../locale';

const { height: windowHeight } = Dimensions.get('window');

interface Props {
  navigation: NavigationProp<any>;
  title: string;
  children?: ReactElement;
};

export const ModalTemplate: FC<Props> = ({ navigation, title, children }) => {
  const backgroundAnimation = useRef(new Animated.Value(0));
  const translateY = backgroundAnimation.current.interpolate({
    inputRange: [0, 1],
    outputRange: [windowHeight, 0],
  });

  const animationOnOpen = () => {
    Animated.timing(backgroundAnimation.current, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const animationGoBack = () => {
    Animated.timing(backgroundAnimation.current, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setTimeout(() => navigation.goBack(), 200);
  };

  useEffect(() => {
    animationOnOpen();
  }, []);

  return (
      <Animated.View style={[styles.overlay]}>
        <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
          <View style={styles.modalInsideView}>
            <StyledText style={styles.modalTitle}>{i18n.t(title)}</StyledText>
            <IconButton
              name='close'
              type='material'
              color={palette.textBody}
              onPress={animationGoBack}
              iconButtonStyle={styles.closeModalIcon}
            />
            <View style={styles.inputContainer}>
                {children}
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
  }
});
