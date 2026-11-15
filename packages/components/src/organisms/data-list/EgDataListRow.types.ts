import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { MotionPressIntensity } from '../../shared/themeScalars.js';
import type { ThemeMode } from '../../theme/index.js';
import type { EgDataListRowLayout } from './egDataListMetrics.js';

export type EgDataListRowProps = {
  /**
   * 业务内容插槽（行高由其布局 + `layout.padV` 上下内边距决定，无固定行高）。
   */
  children: ReactNode;
  accessibilityLabel: string;
  onPress?: () => void;
  onLongPress?: () => void;
  /** iOS 压感 / 3D Touch 回调 · 须 `forceTouchEnabled`。 */
  onForcePress?: () => void;
  testID?: string;
  mode?: ThemeMode;
  axis?: 'row' | 'column';
  /** 主轴子项间距 · 横排默认 `layout.contentGap`（spacing-3 · 12px 图形↔文本）。 */
  gap?: number;
  /** 加在行壳上；勿设 `height` / `minHeight` 冒充行高（除非业务刻意撑满）。 */
  contentStyle?: StyleProp<ViewStyle>;
  layout?: EgDataListRowLayout;
  /** 默认随 `onPress` / `onLongPress` / Force 推断；`false` 为只读行。 */
  interactive?: boolean;
  pressIntensity?: MotionPressIntensity;
  /** 压感 / 3D Touch · 默认 `false`。 */
  forceTouchEnabled?: boolean;
};