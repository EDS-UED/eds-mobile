import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';
import type { GlassVariant } from '../../../atoms/glass/types.js';
import type { ControlSize } from '../../../shared/types.js';
import type { ThemeMode } from '../../../theme/index.js';

export type EgButtonGlassKind = 'text' | 'icon';

export type EgButtonGlassIconCount = 1 | 2;

export type EgButtonGlassProps = {
  /** 文本胶囊 / 圆形 / 双 icon 胶囊 — 导航栏玻璃按钮。 */
  kind: EgButtonGlassKind;
  /** `kind="text"` 时必填。 */
  label?: string;
  /** `kind="icon"` — 主 symbol（双 icon 时为左侧）。 */
  icon?: string;
  /** `kind="icon"` — 1 或 2；为 2 时右侧为 `iconAlt` 或 `avatarSlot`。 */
  iconCount?: EgButtonGlassIconCount;
  /** `iconCount={2}` 且无 `avatarSlot` 时的右侧 symbol。 */
  iconAlt?: string;
  /**
   * `kind="icon"` 头像槽 — `EgAvatar size="lg"`（36px）。
   * - `iconCount={1}`：替换唯一 icon（圆钮内仅头像）
   * - `iconCount={2}`：替换右侧 icon（左 symbol + 右头像）
   */
  avatarSlot?: ReactNode;
  /** legacy — 同 `avatarSlot`（`iconCount={1}`）。 */
  iconSlot?: ReactNode;
  /** legacy — 同 `avatarSlot`（`iconCount={2}` 右侧）。 */
  iconSlotEnd?: ReactNode;
  /** 文本胶囊字号 / 边距档 — 与 EgButton 一致（RN / iOS 26+ 原生 Pressable 同 token）。 */
  size?: ControlSize;
  mode?: ThemeMode;
  variant?: GlassVariant;
  disabled?: boolean;
  onPress?: () => void;
  testID?: string;
  accessibilityLabel?: string;
  style?: ViewStyle;
};
