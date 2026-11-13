import type {
  ButtonFigmaType,
  ControlSize,
  EgCommonProps,
  EgLabelProps,
  FieldEvent,
  OptionLabelStyle,
} from '../../shared/types.js';
import type { ViewStyle } from 'react-native';

export type EgSceneButtonProps = EgCommonProps &
  EgLabelProps & {
    figmaType?: ButtonFigmaType;
    size?: ControlSize;
    disabled?: boolean;
    loading?: boolean;
    active?: boolean;
    labelStyle?: OptionLabelStyle;
    onPress?: () => void;
    style?: ViewStyle;
  };

export type EgFieldProps = EgCommonProps & {
  size?: ControlSize;
  event?: FieldEvent;
  disabled?: boolean;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  echoValue?: string;
  /** Entering / Done 内联清空（Figma eds-close）；Input 默认 true。 */
  showClear?: boolean;
  showPaste?: boolean;
  showUnit?: boolean;
  showMax?: boolean;
  unit?: string;
  onChangeText?: (text: string) => void;
  onPress?: () => void;
  onClear?: () => void;
  onPaste?: () => void;
  onMax?: () => void;
  style?: ViewStyle;
};
