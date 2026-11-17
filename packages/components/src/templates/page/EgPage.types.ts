import type { ReactNode, Ref } from 'react';
import type { ScrollViewProps, StyleProp, ViewStyle } from 'react-native';

/** `ScrollView` 实例 ref · 与 RN `scrollTo` 对齐（避免跨包 RN 类型分叉）。 */
export type EgPageScrollViewHandle = {
  scrollTo: (options: { x?: number; y?: number; animated?: boolean }) => void;
};

import type { ThemeMode } from '../../theme/index.js';

export type EgPageProps = Omit<ScrollViewProps, 'children' | 'contentContainerStyle'> & {
  mode?: ThemeMode;
  children: ReactNode;
  /** 页面根样式（`flex: 1` + `box-page` 底色默认已设）。 */
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  /**
   * RN 顶栏底边距（`egNavBarScrollContentReserve`）· 与 `contentInsetAdjustmentBehavior="never"` 联用。
   * iOS 26+ 系统栏场景传 0，`scrollTopInset` 亦为 0、`contentInsetAdjustmentBehavior` 为 `automatic`。
   */
  topInset?: number;
  /** 顶栏占位（不含 spacing-3）；`automatic` 时忽略，仅 `never` 时与 `topInset` 二选一参与计算。 */
  scrollTopInset?: number;
  contentInsetAdjustmentBehavior?: 'automatic' | 'never';
  /**
   * iOS 26+ 是否允许 `useEgNavBarScroll` 驱动系统 scroll edge（`setOptions`）。
   * 与外层 `EgEdsAnimaPage` 固定 scroll edge 时传 `false`。
   */
  nativeScrollEdge?: boolean;
  /** 供外层 `scrollTo` 等 · 与 RN `ScrollView` ref 同型。 */
  scrollViewRef?: Ref<EgPageScrollViewHandle>;
  /**
   * 内容左右内边距（px）· 未传则用 spacing-5（20）。
   * `contentContainerStyle` 同字段后写时以业务为准。
   */
  contentPaddingHorizontal?: number;
  /**
   * 内容顶内边距（px）· 导航占位之后的间距；未传则默认 lg（12）。
   * 与 `scrollTopInset` / `topInset` 叠加逻辑见 `resolveEgPageScrollPaddingTop`。
   */
  contentPaddingTop?: number;
  /**
   * 内容底内边距（px）· 未传则 spacing-10（40）。
   * `contentContainerStyle` 同字段后写时以业务为准。
   */
  contentPaddingBottom?: number;
};