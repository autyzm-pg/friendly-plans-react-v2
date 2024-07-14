/* eslint-disable prettier/prettier */
import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';

import {palette} from '../styles';

interface Props {
  children?: JSX.Element | JSX.Element[];
  padded?: boolean;
  narrow?: boolean;
  darkBackground?: boolean;
  extraStyles?: object;
  scrolling?: boolean;
}

export class FullScreenTemplate extends React.PureComponent<Props> {
  render() {
    const {children, padded, narrow, darkBackground, extraStyles, scrolling} = this.props;
    return (
      <SafeAreaView
        style={[
          styles.safeArea,
          darkBackground && styles.darkBackground,
          extraStyles,
        ]}>
        {/* Commented out lines that cause problems in scrolling and dragging items */}
        {/* //<View style={{ flexDirection: 'row'}}>
        //  {scrolling && <View style={{backgroundColor: 'transparent', width: 30}}></View>} */}
          {/* <ScrollView
            //persistentScrollbar={true} 
            contentContainerStyle={[
              styles.contentContainer,
              padded && styles.padded,
              narrow && styles.narrowContainer,
            ]}> */}
            <View style={[styles.contentContainer, narrow && styles.narrow]}>
              {children}
            </View>
          {/* </ScrollView> */}
        {/* //  {scrolling && <View style={{backgroundColor: 'transparent', width: 30}}></View>}
        //</View> */}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background,
  },
  contentContainer: {
    flexGrow: 1,
  },
  darkBackground: {
    backgroundColor: palette.backgroundSurface,
  },
  padded: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  narrowContainer: {
    alignItems: 'center',
  },
  narrow: {
    width: 400,
  },
});
