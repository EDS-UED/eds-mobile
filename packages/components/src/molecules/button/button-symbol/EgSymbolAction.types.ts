import type { ControlSize, EgCommonProps } from '../../../shared/types.js';
import type { ViewStyle } from 'react-native';
import type { ThemeMode } from '../../../theme/index.js';

/** Figma iCon Container 色调。 */
export type EgSymbolActionTone = 'brand' | 'decor' | 'danger' | 'shallow' | 'plain';

export type EgSymbolActionProps = EgCommonProps & {
  /** 容器 / 图标尺寸档 — scale-14…7 × symbol-md/sm/xs。 */
  size?: ControlSize;
  tone?: EgSymbolActionTone;
  disabled?: boolean;
  loading?: boolean;
  /** EDS icon 资源名，如 `eds-add`。 */
  icon?: string;
  onPress?: () => void;
  style?: ViewStyle;
  mode?: ThemeMode;
};