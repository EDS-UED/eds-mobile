import type { EgCommonProps, EgLabelProps } from '../../../shared/types.js';
import type { ViewStyle } from 'react-native';

/** Figma Message · 色调 */
export type EgMessageTone = 'brand' | 'decor' | 'danger' | 'shallow';

export type EgMessageProps = EgCommonProps &
  EgLabelProps & {
    tone?: EgMessageTone;
    style?: ViewStyle;
  };