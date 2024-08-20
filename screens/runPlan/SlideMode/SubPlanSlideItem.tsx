import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import {IconButton, PlanNameText} from '../../../components';
import {PlanItem, PlanSubItem, StudentDisplayOption} from '../../../models';
import Sound from 'react-native-sound';
import { palette } from '../../../styles';
import { PlanItemTimer } from '../PlanItemTimer';
import { SoundService } from '../../../services/SoundService';

interface Props {
  planSubItem: PlanSubItem;
  index: number;
  textSize: string;
  isUpperCase: boolean;
  type: StudentDisplayOption;
  planItem?: PlanItem;
  onPressIn: () => void;
  onPressOut: () => void;
  goBack: () => void;
  nextPage: () => void;
}

export class SubPlanSlideItem extends React.PureComponent<Props> {
  soundTrack: any;

  componentDidMount() {
    SoundService.lectorStop();
    if (this.props.planSubItem.voicePath?.length > 0) {
      this.soundTrack = new Sound(this.props.planSubItem.voicePath
          .replace('file:///', '/')
          .split('%20').join(' '), Sound.MAIN_BUNDLE);
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any) {
    if (this.soundTrack != null) {
      this.soundTrack.stop();
    }

    if (this.props.planSubItem.voicePath?.length > 0) {
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
    if (this.props.planSubItem.lector && this.props.planSubItem.name) {
      await SoundService.lectorSpeak(this.props.planSubItem.name);
    } else if (this.soundTrack != null) {
      this.soundTrack.play();
    }
  };

  render() {
    const { planSubItem } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.timer}>
          <View style={styles.lectorContainer}>
            {(this.props.planSubItem.lector || this.props.planSubItem.voicePath?.length > 0) 
              ? <IconButton size={64} onPress={this.speak} name="volume-high" type="material-community"/> 
              : <View></View>
            }
            <IconButton name="arrow-back"
                        type="material"
                        size={50}
                        color="#E7DCDA"
                        onPressIn={this.props.onPressIn}
                        onPressOut={this.props.onPressOut}
                        onLongPress={this.props.goBack}
                        delayLongPress={2000}
                        style={{marginBottom: 35}}
            />
          </View>
          <View style={styles.imageAndTextContainer}>
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
                planName={this.props.planSubItem.nameForChild}
                isUpperCase={this.props.isUpperCase}
                textSize={this.props.textSize}
                alignTextCenter
              />
            )}
          </View>
          <View style={styles.timerContainer}>
            {!!this.props.planSubItem.time 
              ? <PlanItemTimer itemTime={this.props.planSubItem.time} /> 
              : <View></View>
            }
            <IconButton name="arrow-bold-right"
                        type="entypo"
                        size={120}
                        color={palette.playButton}
                        onPress={this.props.nextPage}
            />
          </View>
        </View>
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
    height: '100%',
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
  lectorContainer: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: 120
  },
  timerContainer: {
    justifyContent: 'space-between',
    flex: 0,
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: 120
  },
  imageAndTextContainer: {
    height: '100%',
    flex: 1,
    alignItems: 'center'
  }
});
