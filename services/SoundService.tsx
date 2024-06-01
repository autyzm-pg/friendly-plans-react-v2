import Tts from 'react-native-tts';
import {i18n} from '../locale';

export class SoundService {
    static lectorSpeak = async(text: string) => {
        await Tts.getInitStatus().then(() => {
            Tts.setDefaultLanguage(i18n.t('common:language'));
            Tts.speak(text);
          }, (err) => {
            if (err.code === 'no_engine') {
              Tts.requestInstallEngine();
            }
          });
    };

    static lectorStop = async() => {
      Tts.stop();
  };
}