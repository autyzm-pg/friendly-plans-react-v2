import React from 'react';
import { Icon as ElementsIcon, IconProps } from 'react-native-elements';
import { palette } from '../styles/palette';

interface Props extends IconProps {
  delayLongPress?: number;
  onLongPress?: () => void;
  onPress?: () => void;
  color?: string;
  type?: string;
}

export const Icon: React.FC<Props> = ({ delayLongPress, onLongPress, onPress, 
  color = palette.primary, type = 'material-community', ...props }) => (
  <ElementsIcon
    onLongPress={onLongPress}
    delayLongPress={delayLongPress}
    onPress={onPress}
    type={type}
    color={color}
    {...props}
  />
);

export default Icon;

Icon.displayName = 'Icon';
