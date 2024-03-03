import React, { useEffect } from 'react';
import { Animated, Dimensions, ScrollView, StyleSheet, View } from 'react-native';

import { dimensions, getElevation, headerHeight, palette, typography } from '../styles';
import { IconButton } from './IconButton';
import { StyledText } from './StyledText';

import { NavigationProp } from '@react-navigation/native';

const { height: WINDOW_HEIGHT } = Dimensions.get('window');
const CONTAINER_HEIGHT = WINDOW_HEIGHT - headerHeight;
const MODAL_WIDTH = 528;

interface Props {
  children?: React.ReactNode;
  title: React.ReactNode | string;
  buttons?: React.ReactNode;
  isSecondaryView?: boolean;
  canNavigateBack?: boolean;
  navigation: NavigationProp<any>;
}

export const NarrowScreenTemplate: React.FC<Props> = ({ children, title, buttons, isSecondaryView, canNavigateBack=true, navigation }) => {
  const backgroundAnimation = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(backgroundAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  const goBack = () => {
    Animated.timing(backgroundAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setTimeout(() => navigation.goBack(), 200);
  };

  const getHeaderColor = () => ({
    backgroundColor: isSecondaryView ? palette.backgroundAdditional : palette.primaryVariant,
  });

  const renderTitle = () => {
    if (typeof title === 'string') {
      return <StyledText style={styles.headerText}>{title}</StyledText>;
    }

    return title;
  };

  const translateY = backgroundAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [WINDOW_HEIGHT, 0],
  });

  return (
    <Animated.View style={[styles.overlay]}>
      <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
        <View style={[styles.header, getHeaderColor()]}>
          {(canNavigateBack ?? true) && (
            <IconButton
              name="arrow-back"
              type="material"
              size={24}
              color={isSecondaryView ? palette.textBody : palette.textWhite}
              onPress={goBack}
            />
          )}
          {renderTitle()}
          {buttons}
        </View>
        <ScrollView bounces={false} alwaysBounceVertical={false} contentContainerStyle={styles.contentContainer}>
          {children}
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.modalBackgroundOverlay,
  },
  container: {
    ...getElevation(4),
    width: MODAL_WIDTH,
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    height: headerHeight,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
    marginStart: 8,
    ...typography.title,
    color: palette.textWhite,
  },
  contentContainer: {
    minHeight: CONTAINER_HEIGHT,
    backgroundColor: palette.background,
    paddingVertical: dimensions.spacingMedium,
    paddingHorizontal: dimensions.spacingBig,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 12,
  },
});
