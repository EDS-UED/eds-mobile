import { EG_PAGE_CONTENT_PADDING_HORIZONTAL } from '@eds/mobile-components';
import type { StyleProp, ViewStyle } from 'react-native';

/** RN 浮层栏 — ScrollView `contentInsetAdjustmentBehavior`（`ShowcasePageScroll` 默认复用）。 */
export function showcaseNavScrollInset(nativeStackNav: boolean): 'automatic' | 'never' {
  return nativeStackNav ? 'automatic' : 'never';
}

/**
 * @deprecated 路由滚动改 {@link ShowcasePageScroll} / `EgPage`；仅兼容遗留调用。
 */
export function showcaseNavScrollContentStyle(
  nativeStackNav: boolean,
  rnScrollPaddingTop: number,
  base?: StyleProp<ViewStyle>,
): StyleProp<ViewStyle> {
  if (nativeStackNav) {
    return base;
  }
  return [
    base,
    {
      paddingTop: rnScrollPaddingTop,
      paddingHorizontal: EG_PAGE_CONTENT_PADDING_HORIZONTAL as number,
    },
  ];
}