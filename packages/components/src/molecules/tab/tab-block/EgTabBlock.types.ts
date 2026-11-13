import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';

import type { ThemeMode } from '../../../theme/index.js';

export type EgTabBlockItem = {
  id: string;
  label: string;
  count?: number;
  disabled?: boolean;
};

export type EgTabBlockProps = {
  items: EgTabBlockItem[];
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
   * 正文区左右滑切分段 · 默认在传入 `children` 时为 true。
   * 与 `useEgHorizontalSegmentSwipe` 行为一致。
   */
  contentSwipeToSwitch?: boolean;
};
