import React from 'react';
import { Image, NativeModules, StyleSheet, View } from 'react-native';

import Voice from '@react-native-voice/voice';
import {IconButton, PlanNameText} from '../../../components';
import { PlanItem, StudentDisplayOption } from '../../../models';
import Sound from 'react-native-sound';
import Tts from 'react-native-tts';
import { palette } from '../../../styles';
import sounds from '../../../assets/sounds/sounds';
import { PlanItemTimer } from '../PlanItemTimer';

interface Props {
  planItem: PlanItem;
  index: number;
  textSize: string;
  isUpperCase: boolean;
  type: StudentDisplayOption;
  timerStop: boolean;
}

export class PlanSlideItem extends React.PureComponent<Props> {
  soundTrack: any;

  componentDidMount() {
    if (this.props.planItem.voicePath.length > 0) {
      this.soundTrack = new Sound(this.props.planItem.voicePath
          .replace('file:///', '/')
          .split('%20').join(' '), Sound.MAIN_BUNDLE);
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any) {
    if (this.soundTrack != null) {
      this.soundTrack.stop();
    }

    if (this.props.planItem.voicePath.length > 0) {
      this.soundTrack = new Sound(this.props.planItem.voicePath
          .replace('file:///', '/')
          .split('%20').join(' '), Sound.MAIN_BUNDLE);
    }
  }

  componentWillUnmount() {
    if (this.soundTrack != null) {
      this.soundTrack.stop();
      this.soundTrack.release();
    }
  }

  get showText(): boolean {
    const { type } = this.props;
    return type === StudentDisplayOption.ImageWithTextSlide || type === StudentDisplayOption.TextSlide;
  }

  get showImage(): boolean {
    const { type } = this.props;
    return type === StudentDisplayOption.ImageWithTextSlide || type === StudentDisplayOption.LargeImageSlide;
  }


  speak = async () => {
    if (this.props.planItem.lector) {
      if (this.props.planItem.nameForChild) {
        await Tts.getInitStatus().then(() => {
          Tts.setDefaultLanguage('pl');
          Tts.speak(this.props.planItem.nameForChild);
        }, (err) => {
          if (err.code === 'no_engine') {
            Tts.requestInstallEngine();
          }
        });
      }

      return;
    }

    if (this.soundTrack != null) {
      this.soundTrack.play();
    }

  };

  render() {
    const { planItem } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.timer}>
          <View style={{justifyContent: 'flex-start'}}>
            {(this.props.planItem.lector || this.props.planItem.voicePath.length > 0) ? <IconButton size={64} onPress={this.speak} name="volume-high" type="material-community"/> : null}
          </View>
          <View style={{justifyContent: 'flex-end'}}>
            {!!this.props.planItem.time ? <PlanItemTimer itemTime={this.props.planItem.time} timerPause={this.props.timerStop} /> : null}
          </View>
        </View>

        {this.showImage && (
          <View style={styles.imageContainer}>
            <Image
              resizeMode="contain"
              style={styles.image}
              source={{ uri: planItem.image }}
            />
          </View>
        )}
        {this.showText && (
          <PlanNameText
            planName={this.props.planItem.nameForChild}
            isUpperCase={this.props.isUpperCase}
            textSize={this.props.textSize}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  timer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 0.35,
  },
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    backgroundColor: palette.background,
    flexDirection: 'column',
  },
  imageContainer: {
    flex: 1,
    alignSelf: 'stretch',
    marginBottom: 16,
  },
  image: {
    flex: 1,
  },
  nameTextColor: {
    color: palette.textBlack,
  },
});
