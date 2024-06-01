import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import {IconButton, PlanNameText} from '../../../components';
import { PlanItem, StudentDisplayOption } from '../../../models';
import Sound from 'react-native-sound';
import { palette } from '../../../styles';
import { PlanItemTimer } from '../PlanItemTimer';
import { SoundService } from '../../../services/SoundService';

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
    SoundService.lectorStop();
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
    SoundService.lectorStop();

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
    SoundService.lectorStop();
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
    if (this.props.planItem.lector && this.props.planItem.nameForChild) {
      await SoundService.lectorSpeak(this.props.planItem.nameForChild);
    } else if (this.soundTrack != null) {
      this.soundTrack.play();
    }
  };

  render() {
    const { planItem } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.timer}>
          <View style={{justifyContent: 'flex-start', flex: 0}}>
            {(this.props.planItem.lector || this.props.planItem.voicePath.length > 0) ? <IconButton size={64} onPress={this.speak} name="volume-high" type="material-community"/> : null}
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
          <View style={{justifyContent: 'flex-end', flex: 0}}>
            {!!this.props.planItem.time ? <PlanItemTimer itemTime={this.props.planItem.time} /> : null}
          </View>
        </View>

        {this.showText && (
          <PlanNameText
            planName={this.props.planItem.nameForChild}
            isUpperCase={this.props.isUpperCase}
            textSize={this.props.textSize}
            alignTextCenter
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
    flex: 1,
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
