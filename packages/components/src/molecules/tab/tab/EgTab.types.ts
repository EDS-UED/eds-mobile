import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';

import type { ThemeMode } from '../../../theme/index.js';

export type EgTabItem = {
  id: string;
  label: string;
  disabled?: boolean;
};

/** Figma: Tabs · 491:3819 · 切换时品牌下划线滑动。 */
export type EgTabProps = {
  items: EgTabItem[];
  selectedId?: string;
  defaultSelectedId?: string;
  onSelect?: (id: string, index: number) => void;
  /** 水平滑动（含全宽区域）切换 Tab；默认 true。 */
  swipeToSwitch?: boolean;
  mode?: ThemeMode;
  testID?: string;
  style?: ViewStyle;
  accessibilityLabel?: string;
  /**
   * 可选正文 · 随 Tab 切换走 `motion-layout-content`（标题/Tab 条不动，仅正文 crossfade）。
   * 传入时渲染在 Tab 行下方。
   */
  children?: ReactNode;
  /** 正文动效 key · 默认 `selectedId`。 */
  contentKey?: string;
  /** Tab 切换动效开始时（如 ScrollView `scrollTo({ y: 0 })`）。 */
  onContentSwitchStart?: () => void;
};
