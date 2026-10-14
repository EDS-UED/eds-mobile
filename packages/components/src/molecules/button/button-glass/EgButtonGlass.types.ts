import type { ViewStyle } from 'react-native';
import type { GlassVariant } from '../../../atoms/glass/types.js';
import type { ControlSize } from '../../../shared/types.js';
import type { ThemeMode } from '../../../theme/index.js';

export type EgButtonGlassKind = 'text' | 'icon';

export type EgButtonGlassIconCount = 1 | 2;

export type EgButtonGlassProps = {
  /** 文本胶囊 / 圆形图标 — 导航栏玻璃按钮。 */
  kind: EgButtonGlassKind;
  /** `kind="text"` 时必填。 */
  label?: string;
  /** `kind="icon"` — 主 icon（EDS symbol，如 `eds-list-lattice-mobile`）。 */
  icon?: string;
  /** `kind="icon"` — 1 或 2 个 symbol，最大 2。 */
  iconCount?: EgButtonGlassIconCount;
  /** `iconCount={2}` 时第二个 symbol；缺省复用 `icon`。 */
  iconAlt?: string;
  /** 文本胶囊尺寸 — 与 EgButton 四档边距 / 字号一致；图标圆不受此项影响。 */
  size?: ControlSize;
  mode?: ThemeMode;
  /** 导航栏控件默认 `clear`，与 iOS 工具栏液态玻璃一致。 */
  variant?: GlassVariant;
  disabled?: boolean;
  onPress?: () => void;
  testID?: string;
  accessibilityLabel?: string;
  /**
   * Showcase / catalog Preview：强制 RN + `glass-button-box`（iOS 26+ 默认可走系统 Liquid Glass）。
   */
  forceRnImplementation?: boolean;
  style?: ViewStyle;
};
