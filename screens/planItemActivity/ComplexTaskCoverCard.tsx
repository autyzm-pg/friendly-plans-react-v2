import React, {FC} from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';

import {Card, StyledText} from '../../components';
import {Image} from 'react-native-elements';
import {i18n} from '../../locale';
import { dimensions, palette, typography } from '../../styles';

interface Props {
  name: string;
  image: string;
  selected?: boolean;
  onSelectChange: () => void;
}



export const ComplexTaskCoverCard: FC<Props> = ({ name, image,
  selected = false, onSelectChange}) => {

  const showInfo = () => {
    return (
        <View style={styles.imageActionContainer}>
          <Text style={{fontSize: 15}}>{i18n.t('planItemActivity:complexTaskCoverInfo')}</Text>
        </View>
    );
  };



  return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <View style={[styles.leftContainer, selected && styles.backgroundPrimary]}/>
          <TouchableHighlight underlayColor={'none'} style={styles.rightContainer} onPress={onSelectChange}>
            <View>
              <View style={styles.timeContainer}>
                  <StyledText style={styles.iconButtonContainer}>{i18n.t('planItemActivity:complexTaskCover')}</StyledText>
              </View>
              <View style={styles.taskContainer}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.image} />
                ) : (
                    <StyledText>{i18n.t('planItemActivity:complexTaskPhotoPlaceholder')}</StyledText>
                )}
                <StyledText style={styles.name}>{name}</StyledText>
              </View>
            </View>
          </TouchableHighlight>
        </Card>
      </View>
  );
};

const styles = StyleSheet.create({
  imageActionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: dimensions.spacingLarge,
  },
  image: {
    width: 50,
    height: 50,
  },
  container: {
    marginHorizontal: 3,
    marginTop: 3,
    marginBottom: dimensions.spacingMedium,
  },
  card: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 0,
    paddingHorizontal: 0,
    height: 144,
  },
  leftContainer: {
    justifyContent: 'space-between',
    height: '100%',
    borderBottomLeftRadius: dimensions.spacingSmall,
    borderTopLeftRadius: dimensions.spacingSmall,
    backgroundColor: palette.backgroundAdditional,
    paddingVertical: dimensions.spacingMedium,
    paddingHorizontal: dimensions.spacingSmall,
  },
  rightContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: dimensions.spacingMedium,
    paddingBottom: dimensions.spacingBig,
    paddingRight: dimensions.spacingMedium,
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  taskContainer: {
    alignItems: 'center',
  },
  time: {
    ...typography.headline6,
    color: palette.textInputPlaceholder,
  },
  name: {
    ...typography.headline6,
    color: palette.textBody,
    marginTop: dimensions.spacingBig,
  },
  backgroundPrimary: {
    backgroundColor: palette.primary,
  },
  imageInputText: {
    ...typography.taskInput,
    textAlign: 'center',
  },
  iconButtonContainer: {
    backgroundColor: palette.backgroundAdditional,
    paddingVertical: 4,
    paddingHorizontal: dimensions.spacingSmall,
    borderRadius: 8,
  },
});
