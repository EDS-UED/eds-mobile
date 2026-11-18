import type { ButtonFigmaType, ControlSize, EgCommonProps } from '../../../shared/types.js';
import type { ViewStyle } from 'react-native';
import type { ThemeMode } from '../../../theme/index.js';

export type EgSymbolActionProps = EgCommonProps & {
  size?: ControlSize;
  figmaType?: ButtonFigmaType;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
  onPress?: () => void;
  style?: ViewStyle;
  mode?: ThemeMode;
};