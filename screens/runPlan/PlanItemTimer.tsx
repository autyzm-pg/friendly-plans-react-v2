import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Icon, StyledText } from 'components';

import Sound from 'react-native-sound';
import sounds from '../../assets/sounds/sounds';

interface Props {
  itemTime: number;
  timerPause?: boolean;
}

interface State {
  itemTime: number;
  isPlaying: boolean;
  currentLoop: number;
  pause: boolean;
}

export class PlanItemTimer extends React.PureComponent<Props, State> {
  timerID: any;
  soundTrack: any;
  maxLoop: number = 50;

  state: Readonly<State> = {
    itemTime: this.props.itemTime,
    isPlaying: false,
    currentLoop: 0,
    pause: false,
  };

  // seconds = () => (this.state.itemTime % 60 < 10 ? '0' : '') + (this.state.itemTime % 60);
  // minutes = () => Math.floor(this.state.itemTime / 60);
  // hours = () => Math.floor(this.state.itemTime / 3600);

  hours = () => Math.floor(this.state.itemTime / 3600);
  minutes = () => Math.floor((this.state.itemTime - this.hours()*3600) / 60);
  seconds = () => this.state.itemTime - this.minutes()*60 - this.hours()*3600;



  itemTimeText = () => this.hours() + ':' + this.minutes() + ':' + this.seconds();

  componentWillReceiveProps(nextProps: Props) {
    this.setState({ itemTime: nextProps.itemTime });
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
    if (this.props.timerPause && this.state.isPlaying) {
      this.soundTrack.stop();
      this.timerID = setInterval(() => this.tick(), 1000);
      this.setState({isPlaying: false});
    }
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
    this.initializeAlarm();
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
    this.soundTrack.stop();
    this.soundTrack.release();
  }

  initializeAlarm = () => {
    this.soundTrack = new Sound(sounds.timerEndOfTime, Sound.MAIN_BUNDLE, error => {
      if (error) {
        this.setState({ isPlaying: false });
      }
    });
  };

  playInLoop = () => {
    const { currentLoop } = this.state;
    if (currentLoop < this.maxLoop) {
      // this.setState({ currentLoop: currentLoop + 1 });
      this.soundTrack.play((success: boolean) => {
        if (success) {
          this.playInLoop();
        }
      });
    } else {
      this.soundTrack.stop();
    }
  };

  HandleTimesUp = async () => {
    this.setState({ isPlaying: true });
    this.playInLoop();
    clearInterval(this.timerID);
  };

  decreaseTime = async () => {

    if (!this.props.timerPause) {
      this.setState(state => ({itemTime: state.itemTime - 1}));
    }

  }

  tick = () => {
    if (!this.state.pause) {
      this.state.itemTime <= 0 ? this.HandleTimesUp() : this.decreaseTime();
    }
  };

  stopAlarm = () => {
    if(this.state.isPlaying) {
      this.soundTrack.stop();
      this.setState({ isPlaying: false, pause: false });
    } else {
      this.soundTrack.stop();
      this.setState({pause: !this.state.pause});
    }

  };

  resetTimer = () => {
    if (this.state.isPlaying || this.state.itemTime <= 0) {
      this.timerID = setInterval(() => this.tick(), 1000);
      this.setState({ isPlaying: false, pause: false});
    }
    this.setState({itemTime: this.props.itemTime, pause: false});
    this.soundTrack.stop();
  };

  render() {
    return (
      <View style={styles.timeContainer}>
        <Icon onPress={this.stopAlarm} onLongPress={this.resetTimer} delayLongPress={2000} name="timer" size={64} />
        <StyledText style={styles.timeText}>{this.itemTimeText()}</StyledText>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  timeContainer: {
    flex: 1,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 32,
  },
});
