import firebase from '@react-native-firebase/app';

export default class CrashlyticsService {
  enabled: boolean;

  constructor() {
    /* istanbul ignore if */
    if (!__DEV__) {
      firebase.crashlytics().enableCrashlyticsCollection();
    }
    this.enabled = !__DEV__;
  }
}
