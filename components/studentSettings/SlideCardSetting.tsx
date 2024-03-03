import React, { FC } from 'react';

import { SwitchItem } from '../../components';
import { i18n } from '../../locale';

interface Props {
  value: boolean;
  onValueChange: (isUpperCase: boolean) => void;
}

export const SlideCardSetting: FC<Props> = ({value, onValueChange}) => {
  return (
    <SwitchItem
      label={i18n.t('studentSettings:blockSwipe')}
      value={value}
      onValueChange={onValueChange}
    />
  );
}
