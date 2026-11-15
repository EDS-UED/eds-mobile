import type { ViewStyle } from 'react-native';

import type { EgCommonProps, ToggleSize } from '../../../shared/types.js';
import type { ThemeMode } from '../../../theme/index.js';

/** Figma: Switch · Toggle 切换✅ */
export type EgSwitchProps = EgCommonProps & {
  size?: ToggleSize;
  value?: boolean;
  defaultValue?: boolean;
  disabled?: boolean;
  onValueChange?: (value: boolean) => void;
  style?: ViewStyle;
  mode?: ThemeMode;
  /** Showcase / 联调 — 强制 RN 自绘轨道。 */
  forceRnImplementation?: boolean;
};