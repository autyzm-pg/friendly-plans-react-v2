import { i18n } from '../../locale';
import React, { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { StudentDisplayOption } from '../../models';
import { dimensions, getElevation, palette } from '../../styles';
import { PlanNameText } from '../PlanNameText';

interface Props {
  displaySettings: string;
  textSize: string;
  isUpperCase: boolean;
}

export const PlanDisplayPreview: FC<Props> = ({ displaySettings, textSize, isUpperCase }) => {
  const renderImage = () => {
    if (displaySettings !== StudentDisplayOption.TextSlide && displaySettings !== StudentDisplayOption.TextList) {
      return <Image style={styles.planImage} source={require('../../assets/images/kids-playing.png')} />;
    }

    return null;
  };

  const renderText = () => {
    if (displaySettings !== StudentDisplayOption.LargeImageSlide) {
      return (
        <PlanNameText
          planName={i18n.t('studentSettings:planCardPlacehorder')}
          textSize={textSize}
          isUpperCase={isUpperCase}
          isSettingsPreview={true}
          alignTextCenter
        />
      );
    }

    return null;
  };

  const isListPreview =
    displaySettings === StudentDisplayOption.ImageWithTextList || displaySettings === StudentDisplayOption.TextList;

  const planCardStyles = [styles.planCard, isListPreview && styles.planCardList];
  const firstCardStyles = [...planCardStyles, styles.firstPlanCard, isListPreview && styles.firstPlanCardList];
  const secondCardStyles = [...planCardStyles, styles.secondPlanCard, isListPreview && styles.secondPlanCardList, !isListPreview && styles.secondPlanCardNotList];

  return (
    <View style={styles.previewContainer}>
      <View style={firstCardStyles}>
        {renderImage()}
        <View style={styles.planText}>{renderText()}</View>
      </View>
      <View style={secondCardStyles}>
        {renderImage()}
        <View style={styles.planText}>{renderText()}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  previewContainer: {
    width: '100%',
    marginTop: dimensions.spacingTiny,
    marginBottom: dimensions.spacingLarge,
    borderRadius: 8,
    backgroundColor: palette.sliderBackground,
    alignItems: 'center',
  },
  planCard: {
    backgroundColor: palette.background,
    borderRadius: dimensions.spacingMedium,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: dimensions.spacingMedium,
  },
  planCardList: {
    paddingLeft: dimensions.spacingMedium,
    paddingRight: dimensions.spacingBig,
    paddingTop: dimensions.spacingBig,
  },
  firstPlanCard: {
    ...getElevation(4),
    marginTop: dimensions.spacingMedium,
    height: 210,
    width: 350,
    zIndex: 1,
  },
  firstPlanCardList: {
    flexDirection: 'row',
    height: 109,
  },
  secondPlanCard: {
    ...getElevation(3),
    height: 35,
    width: 320
  },
  secondPlanCardNotList: {
    top: -19
  },
  secondPlanCardList: {
    flexDirection: 'row',
    height: 109,
    width: 350,
    marginTop: dimensions.spacingTiny,
    marginBottom: dimensions.spacingMedium,
    translateY: 0,
  },
  planText: {
    width: '70%',
  },
  planImage: {
    flex: 1,
    aspectRatio: 1,
  },
});
