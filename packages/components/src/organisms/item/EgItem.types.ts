import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { EgMenuItem } from '../../molecules/dropdown/menu/EgMenu.types.js';
import type { MotionPressIntensity } from '../../shared/themeScalars.js';
import type { ThemeMode } from '../../theme/index.js';

export type EgItemTrailingDisplay = 'icon' | 'menu' | 'switch' | 'custom';

export type EgItemProps = {
  /** 主文案 · typography-body-medium · text-base-primary */
  label: string;
  /** 主文案加粗 · typography-body-medium-heavy */
  labelHeavy?: boolean;
  /** 右侧附属说明 · typography-body-small · text-base-secondary */
  value?: string;
  /** 左侧图形插槽 */
  icon?: ReactNode;
  /** 展示右侧挂件 · 默认 `true` */
  trailingEnabled?: boolean;
  /** 右侧显示 — `icon` 箭头 · `menu` · `switch` · `custom` 插槽 */
  trailingDisplay?: EgItemTrailingDisplay;
  /** `icon` — 无 `value` 时是否显示右箭头 · 默认 `true` */
  showChevron?: boolean;
  /** `menu` — 选项与选中态 */
  menuItems?: EgMenuItem[];
  selectedMenuId?: string;
  onMenuSelect?: (id: string, item: EgMenuItem) => void;
  /** `switch` — 受控 / 非受控 */
  switchValue?: boolean;
  defaultSwitchValue?: boolean;
  onSwitchValueChange?: (value: boolean) => void;
  /** `custom` — 业务右侧插槽（优先于内置挂件） */
  trailing?: ReactNode;
  /** 行底 module 分割线（缩进对齐图标后文案）· 默认 `true` */
  showDivider?: boolean;
  onPress?: () => void;
  /** 行点按底 + 缩放（无 `onPress` 时仅视觉反馈） */
  showPressFeedback?: boolean;
  testID?: string;
  mode?: ThemeMode;
  pressIntensity?: MotionPressIntensity;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};