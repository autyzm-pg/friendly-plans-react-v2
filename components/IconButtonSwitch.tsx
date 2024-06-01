import React, { FC } from 'react';
import { Platform, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

import { palette } from '../styles';
import { Button } from './Button';
import { StyledText } from './StyledText';

interface Props {
  iconNames: string[];
  titles: string[];
  title: string;
  secondButtonOn?: boolean;
  onPress: (completed: boolean) => Promise<void>;
};

export const IconButtonSwitch: FC<Props> = ({ iconNames, titles, title, secondButtonOn, onPress }) => {
  const isAndroid5 = 22 === Platform.Version;
  return (
    <TouchableWithoutFeedback>
      <View style={styles.viewContainer}>
        <StyledText>{title}</StyledText>
        <View style={styles.toggleButtonContainer}>
          <View>
            <Button
              title={titles[0]}
              icon={{
                name: iconNames[0],
                type: 'material',
                color: (!secondButtonOn) ? palette.textWhite : palette.primaryVariant,
                backgroundColor: (!secondButtonOn) ? palette.backgroundPositive: palette.backgroundAdditional,
                size: 22,              
              }}
              isUppercase
              buttonStyle={[styles.buttonStyle, (!secondButtonOn) && styles.leftButtonOn]}
              titleStyle={{color: (!secondButtonOn && !isAndroid5) ? palette.textWhite : palette.primaryVariant}}
              onPress={() => { onPress(true); }}
              hitSlop={{ top: 25, bottom: 25, left: 25, right: 25 }}
            />
          </View>
          <View>
            <Button
              title={titles[1]}
              icon={{
                name: iconNames[1],
                type: 'material',
                color: (secondButtonOn) ? palette.textWhite : palette.primaryVariant,
                backgroundColor: secondButtonOn ? palette.backgroundNeutral: palette.backgroundAdditional,
                size: 22,              
              }}
              isUppercase
              buttonStyle={[styles.buttonStyle, secondButtonOn && styles.rightButtonOn]}
              titleStyle={{color: (secondButtonOn && !isAndroid5) ? palette.textWhite : palette.primaryVariant}}
              onPress={() => { onPress(false); }}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    marginHorizontal: 30,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: palette.informationIcon,
  },
  toggleButtonContainer: {
    borderRadius: 20,
    backgroundColor: palette.backgroundAdditional,
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonStyle: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    height: 26,
    backgroundColor: palette.backgroundAdditional,
    color: palette.primaryVariant
  },
  leftButtonOn: {
    backgroundColor: palette.backgroundPositive,
  },
  rightButtonOn: {
    backgroundColor: palette.backgroundNeutral,
  },
});
