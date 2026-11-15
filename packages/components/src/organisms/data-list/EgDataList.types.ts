import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';

import type { ThemeMode } from '../../theme/index.js';

export type EgDataListProps = {
  /** `EgDataListRow` 列表 · 行壳（spacing-2 外边距）+ 行内 spacing-3 + 内容插槽。 */
  children: ReactNode;
  mode?: ThemeMode;
  testID?: string;
  accessibilityLabel?: string;
  /** 父级 Scene 水平 inset · 默认 `spacing-5`；用于 DL-bleed。 */
  sceneContentInset?: number;
  /** 行间距 · 默认 `spacing-1`（4px）· 常量 `EG_DATA_LIST_ROW_GAP`。 */
  rowGap?: number;
  style?: ViewStyle;
};