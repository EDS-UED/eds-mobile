import type { StyleProp, ViewStyle } from 'react-native';

/** RN 浮层栏 — ScrollView `contentInsetAdjustmentBehavior`。 */
export function showcaseNavScrollInset(nativeStackNav: boolean): 'automatic' | 'never' {
  return nativeStackNav ? 'automatic' : 'never';
}

/** RN 浮层栏 — 内容区 `paddingTop`（`egNavBarScrollContentReserve`）。 */
export function showcaseNavScrollContentStyle(
  nativeStackNav: boolean,
  rnScrollPaddingTop: number,
  base?: StyleProp<ViewStyle>,
): StyleProp<ViewStyle> {
  if (nativeStackNav) {
    return base;
  }
  return [base, { paddingTop: rnScrollPaddingTop }];
}