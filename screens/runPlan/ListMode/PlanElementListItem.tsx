import {Card, IconButton, PlanNameText} from '../../../components';
import {Plan, PlanElement, PlanItem, PlanItemType, PlanSubItem, Student, StudentDisplayOption} from '../../../models';
import {Route} from '../../../navigation';
import React from 'react';
import {Image, StyleSheet, TouchableHighlight, View, ViewStyle} from 'react-native';
import {Icon} from 'react-native-elements';
import Sound from 'react-native-sound';
import Tts from 'react-native-tts';
import {NavigationService} from '../../../services';
import {palette} from '../../../styles';
import {PlanItemTimer} from '../PlanItemTimer';
import { NavigationProp } from '@react-navigation/native';

interface Props {
  student: Student;
  itemParent: PlanItem | Plan;
  item: PlanElement;
  index: number;
  currentTaskIndex: number;
  navigation: NavigationProp<any>;
  isSubItemsList?: boolean;
  isSubItem?: boolean;
  onItemCompleted: (completedItem: PlanItem | PlanSubItem) => void;
  onItemUncompleted: (uncompletedItem: PlanItem | PlanSubItem) => void;
}

export class PlanElementListItem extends React.PureComponent<Props> {
  soundTrack: any;

  componentDidMount() {
    if (this.props.item.voicePath?.length && this.props.item.voicePath.length > 0) {
      this.soundTrack = new Sound(this.props.item.voicePath!
        .replace('file:///', '/')
        .split('%20').join(' '), Sound.MAIN_BUNDLE);
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any) {
    if (this.soundTrack != null) {
      this.soundTrack.stop();
    }

    if (this.props.item.voicePath?.length && this.props.item.voicePath.length > 0) {
      this.soundTrack = new Sound(this.props.item.voicePath!
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


  container(): ViewStyle {
    return this.props.item.completed ? styles.containerCompleted : styles.container;
  }

  nameTextColor(): ViewStyle {
    return this.props.item.completed ? styles.nameTextColorCompleted : styles.nameTextColor;
  }

  markItemPlanAsCompleted = () => {
    if (this.props.index === this.props.currentTaskIndex) {
      this.props.item.completed = true;
      if (this.props.isSubItem) {
        (this.props.item as PlanSubItem).complete().then(() => {
          this.props.onItemCompleted(this.props.item as PlanSubItem)
        });
      } else {
        (this.props.item as PlanItem).complete().then(() => {
          this.props.onItemCompleted(this.props.item as PlanItem)
        });
      }
    }
    console.log(this.props.item)
  };

  markItemPlanAsUncompleted = () => {
    if (this.props.index < this.props.currentTaskIndex) {
      this.props.item.completed = false;
      if (this.props.isSubItem) {
        (this.props.item as PlanSubItem).uncomplete().then(() => {
          this.props.onItemUncompleted(this.props.item as PlanSubItem)
        });
      } else {
        (this.props.item as PlanItem).uncomplete().then(() => {
          this.props.onItemUncompleted(this.props.item as PlanItem)
        });
      }
    }
  };

  navigateToRunPlanSubItemsList = () => {
    this.props.navigation.navigate(Route.RunSubPlanList, {
      itemParent: this.props.item,
      student: this.props.student,
      onGoBack: () => {
        this.markItemPlanAsCompleted();
        this.props.navigation.goBack();
      },
    });
  };

  handlePress = () => {
    if (this.props.item.type === PlanItemType.ComplexTask) {
      if (this.props.index === this.props.currentTaskIndex) {
        return this.navigateToRunPlanSubItemsList;
      }
    } else {
      return this.markItemPlanAsCompleted;
    }
  };

  handleLongPress = () => {
    console.log(this.props.index, this.props.currentTaskIndex, this.props.item.completed)
    // Before - can only go back one task
    //if ((this.props.index === this.props.currentTaskIndex - 1) && this.props.item.completed) {
    if ((this.props.index < this.props.currentTaskIndex) && this.props.item.completed) {
      this.markItemPlanAsUncompleted();
    }
  };

  isTimerAvailableForElement = (): boolean =>
    !!this.props.item.time && this.props.index === this.props.currentTaskIndex;


  get showImage(): boolean {
    const type = this.props.student.displaySettings;
    return type === StudentDisplayOption.ImageWithTextList;
  }

  speak = async () => {

    if (this.props.item.lector) {
      const text = (this.props.item.type === PlanItemType.SubElement) ? this.props.item.name : this.props.item.nameForChild!;
      if (text) {
        await Tts.getInitStatus().then(() => {
          Tts.setDefaultLanguage('pl');
          Tts.speak(text);
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
    return (
      <TouchableHighlight underlayColor={palette.underlay} style={styles.touchable} onPress={this.handlePress()}
                onLongPress={this.handleLongPress} delayLongPress={2000}>
        <Card
          style={[styles.container, (this.props.currentTaskIndex === this.props.index) && {backgroundColor: palette.playButton}]}>
          <View
            style={[this.container(), (this.props.currentTaskIndex === this.props.index) && {backgroundColor: palette.playButton}]}>
            <View style={{flex: 1}}>
              {(this.props.item.lector || this.props.item.voicePath) ?
                <IconButton disabled={Boolean(this.props.item.completed)} size={64} onPress={this.speak}
                      name="volume-high"
                      type="material-community"/> : null}
            </View>


            <View style={{flex: 1}}>
              {(this.showImage && this.props.item.image) ? (
                <Image
                  resizeMode={'contain'}
                  style={styles.image}
                  source={{uri: this.props.item.image!}}
                />) : null}
            </View>


            <View style={{flex: 1}}>
              <PlanNameText
                planName={(this.props.item.type === PlanItemType.SubElement) ? this.props.item.name : this.props.item.nameForChild!}
                isUpperCase={this.props.student.isUpperCase}
                textSize={this.props.student.textSize}
              />
            </View>

            <View style={{flex: 1}}>
              {this.isTimerAvailableForElement() ?
                <PlanItemTimer itemTime={this.props.item.time}/> : null}
            </View>

          </View>

          {this.props.item.completed ?
            <Icon name={'check'} type={'antdesign'} size={65} color={'#40E009'}/> : null}
        </Card>

      </TouchableHighlight>


    );

  }
}

const styles = StyleSheet.create({
  touchable: {
    margin: 8,
    borderRadius: 8,
    flex: 6,
    flexDirection: 'row',
  },
  nameTextColor: {
    flex: 5,
    color: palette.textBlack,
    textAlignVertical: 'center',
  },
  nameTextColorCompleted: {
    flex: 5,
    color: palette.textWhite,
    textAlignVertical: 'center',
  },
  card: {
    flex: 1,
    margin: 0,
  },
  container: {
    backgroundColor: palette.background,
    flex: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  containerCompleted: {
    // backgroundColor: palette.primaryVariant,
    backgroundColor: palette.background,
    flex: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    opacity: 0.2,
  },
  image: {
    flex: 1,
    width: 100,
    height: 100,
  },
});