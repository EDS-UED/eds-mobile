import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';

import type { ThemeMode } from '../../../theme/index.js';

export type EgToggleItem = {
  id: string;
  label: string;
  count?: number;
  disabled?: boolean;
};

export type EgToggleProps = {
  items: EgToggleItem[];
  selectedId: string;
  onSelect: (id: string, index: number) => void;
  mode?: ThemeMode;
  parentContentInset?: number;
  testID?: string;
  style?: ViewStyle;
  accessibilityLabel?: string;
  /**
   * 可选正文 · 随分段切换走 `motion-layout-content`（胶囊条不动，仅正文 crossfade）。
   * 传入时渲染在胶囊条下方；正文区撑满父级剩余高度（父级须可伸展，如 ScrollView `contentContainerStyle.flexGrow: 1`），空白处同样可左右滑切。
   */
  children?: ReactNode;
  /** 正文动效 key · 默认 `selectedId`。 */
  contentKey?: string;
  /** 正文切换动效开始时（如 ScrollView `scrollTo({ y: 0 })`）。 */
  onContentSwitchStart?: () => void;
  /**
   * 整区（胶囊条 + 正文）左右 Swipe / Fling 切分段 · 默认 `true`。
   */
  swipeToSwitch?: boolean;
  /** 与 `swipeToSwitch` 同义 · 仅传 `children` 时曾默认 true。 */
  contentSwipeToSwitch?: boolean;
};