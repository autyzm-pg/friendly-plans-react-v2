import React from 'react';
import { StyleSheet, View } from 'react-native';

import { dimensions, fonts, getElevation, palette } from '../styles';
import { IconButton } from './IconButton';
import { Button } from './Button';
import { Text } from 'react-native-elements';
import { StyledText } from './StyledText';

interface Props {
  iconNames: string[];
  titles: string[];
  title: string;
  secondButtonOn?: boolean;
  onPress: (value: boolean) => void;
}

interface State {
  isFirstButtonOn: boolean;
}

export class IconButtonSwitch extends React.PureComponent<Props, State> {
  state = {
    isFirstButtonOn: !this.props.secondButtonOn,
  };

  handlePressFirst = () => {
    this.setState({
      isFirstButtonOn: true,
    });
    this.props.onPress(true);
  };

  handlePressSecond = () => {
    this.setState({
      isFirstButtonOn: false,
    });
    this.props.onPress(false);
  };

  render() {
    const [firstIcon, secondIcon] = this.props.iconNames;
    const [firstTitle, secondTitle] = this.props.titles;
    const { isFirstButtonOn } = this.state;
    const title = this.props.title;

    return (
      <View style={styles.viewContainer}>
      <StyledText style={styles.label}>{title}</StyledText>
      <View style={styles.toggleButtonContainer}>
        <View>
          <Button
            title={firstTitle}
            icon={{
              name: firstIcon,
              type: 'material',
              color: isFirstButtonOn ? palette.textWhite : palette.primaryVariant,
              size: 22,              
            }}
            isUppercase
            buttonStyle={[styles.buttonStyle, isFirstButtonOn && styles.leftButtonOn]}
            titleStyle={{color: isFirstButtonOn ? palette.textWhite : palette.primaryVariant}}
            onPress={this.handlePressFirst}
            hitSlop={{ top: 25, bottom: 25, left: 25, right: 25 }}
          />
        </View>
        <View>
          <Button
            title={secondTitle}
            icon={{
              name: secondIcon,
              type: 'material',
              color: !isFirstButtonOn ? palette.textWhite : palette.primaryVariant,
              size: 22,              
            }}
            isUppercase
            buttonStyle={[styles.buttonStyle, !isFirstButtonOn && styles.rightButtonOn]}
            titleStyle={{color: !isFirstButtonOn ? palette.textWhite : palette.primaryVariant}}
            onPress={this.handlePressSecond}
          />
        </View>
      </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    marginHorizontal: 30,
    paddingVertical: 8
  },
  toggleButtonContainer: {
    borderRadius: 20,
    backgroundColor: palette.backgroundAdditional,
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // width: 160,
  },
  buttonOff: {

  },
  buttonLeft: {
    // left: -10,
  },
  buttonRight: {
    // right: -10,
  },
  buttonTitleStyle: {
    color: palette.primaryVariant,
    fontSize: 8,
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
  label: {
    
  }
});
