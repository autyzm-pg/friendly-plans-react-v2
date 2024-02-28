import {Button} from '../../components';
import { i18n } from '../../locale';
import React from 'react';
import { StyleSheet } from 'react-native';
import { dimensions, palette } from '../../styles';

interface Props {
    onPress: () => void;
}

export class CopyPlanButton extends React.PureComponent<Props> {
  render() {
    return (
      <Button
        title={i18n.t('planList:copyPlan')}
        icon={{
          name: 'ios-copy',
          type: 'ionicon',
          color: palette.primary,
          size: 14,
        }}
        buttonStyle={styles.button}
        titleStyle={styles.title}
        onPress={this.props.onPress}
      />
    );
  }
}

const styles = StyleSheet.create({
  button: {
    margin: 15,
  },
  title: {
    marginLeft: 3,
    textTransform: 'uppercase',
  },
});
