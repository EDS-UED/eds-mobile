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
  /** 联调 — 强制 `EgSwitchRn`（默认 iOS 26+ 走系统 `UISwitch`）。 */
  forceRnImplementation?: boolean;
};