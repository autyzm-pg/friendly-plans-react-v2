import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import {IconButton, PlanNameText} from 'components';
import {PlanItem, PlanSubItem, StudentDisplayOption} from 'models';
import Sound from 'react-native-sound';
import Tts from 'react-native-tts';
import { palette } from '../styles';
import { PlanItemTimer } from '../PlanItemTimer';

interface Props {
  planSubItem: PlanSubItem;
  index: number;
  textSize: string;
  isUpperCase: boolean;
  type: StudentDisplayOption;
  planItem?: PlanItem;
}

export class SubPlanSlideItem extends React.PureComponent<Props> {
  soundTrack: any;

  componentDidMount() {
    if (this.props.planSubItem.voicePath.length > 0) {
      this.soundTrack = new Sound(this.props.planSubItem.voicePath
          .replace('file:///', '/')
          .split('%20').join(' '), Sound.MAIN_BUNDLE);
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any) {
    if (this.soundTrack != null) {
      this.soundTrack.stop();
    }

    if (this.props.planSubItem.voicePath.length > 0) {
      this.soundTrack = new Sound(this.props.planSubItem.voicePath
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
    if (this.props.planSubItem.lector) {
      if (this.props.planSubItem.name) {
        await Tts.getInitStatus().then(() => {
          Tts.setDefaultLanguage('pl');
          Tts.speak(this.props.planSubItem.name);
        }, (err) => {
          if (err.code === 'no_engine') {
            Tts.requestInstallEngine();
          }
        });

        return;
      }
    }

    if (this.soundTrack != null) {
      this.soundTrack.play();
    }

  };

  render() {
    const { planSubItem } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.timer}>
          <View style={{justifyContent: 'flex-start'}}>
            {(this.props.planSubItem.lector || this.props.planSubItem.voicePath.length > 0) ? <IconButton size={64} onPress={this.speak} name="volume-high" type="material-community"/> : null}
          </View>
          <View style={{justifyContent: 'flex-end'}}>
            {!!this.props.planSubItem.time ? <PlanItemTimer itemTime={this.props.planSubItem.time} /> : null}
          </View>
        </View>
        {this.showImage && (
          <View style={styles.imageContainer}>
            <Image
              resizeMode="contain"
              style={styles.image}
              source={{ uri: planSubItem.image }}
            />
          </View>
        )}
        {this.showText && (
          <PlanNameText
            planName={this.props.planSubItem.name}
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
