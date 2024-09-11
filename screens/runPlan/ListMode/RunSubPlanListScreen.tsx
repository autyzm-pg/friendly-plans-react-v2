import React from 'react';
import { StyleSheet, View } from 'react-native';

import { FullScreenTemplate } from '../../../components';
import { palette } from '../../../styles';
import { PlanElementList } from './PlanElementList';
import { NavigationProp, RouteProp } from '@react-navigation/native';

interface Props {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}

export const RunSubPlanListScreen: React.FC<Props> = ({navigation, route}) => {

    const itemParent = route.params?.itemParent;
    const student = route.params?.student;
    const onGoBack = route.params?.onGoBack;

    return (
      <View style={styles.container}>
        <FullScreenTemplate padded darkBackground>
          <PlanElementList itemParent={itemParent} onGoBack={onGoBack} navigation={navigation} isSubItemsList/>
        </FullScreenTemplate>
      </View>
    );

}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: palette.backgroundSurface,
  },
});
