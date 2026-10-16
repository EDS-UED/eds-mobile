import { Platform } from 'react-native';

import { mobileTheme } from '../../../theme/index.js';

export const TAB_BAR_ITEM_OVERLAP = mobileTheme.spacing['spacing-2'] as number;
export const TAB_BAR_INNER_PADDING = mobileTheme.spacing['spacing-1'] as number;
/** 上 spacing-3 · 左右 spacing-5（Android / iOS 一致） */
export const TAB_BAR_SHELL_PADDING_H = mobileTheme.spacing['spacing-5'] as number;
export const TAB_BAR_SHELL_PADDING_TOP = mobileTheme.spacing['spacing-3'] as number;
/** Android spacing-5 · iOS spacing-7（相对屏幕下沿，home 区不计入布局）。 */
export const TAB_BAR_SHELL_PADDING_BOTTOM =
  Platform.OS === 'ios'
    ? (mobileTheme.spacing['spacing-7'] as number)
    : (mobileTheme.spacing['spacing-5'] as number);

export const TAB_BAR_ITEM_PADDING_VERTICAL = mobileTheme.spacing['spacing-2'] as number;
/** icon ↔ label — `spacing-05`（2px）。 */
export const TAB_BAR_ITEM_GAP = mobileTheme.spacing['spacing-05'] as number;
export const TAB_BAR_ICON_SLOT = mobileTheme.spacing['symbol-lg'] as number;

export const TAB_BAR_PILL_RADIUS = mobileTheme.spacing['radius-full'] as number;
export const TAB_BAR_ICON_SIZE = 'lg' as const;

/** pill track 内容区高度（inner + item + symbol + gap + label token 合计）。 */
export const TAB_BAR_PILL_TRACK_HEIGHT = 64 as const;

/** Tab 轨道内容高度 — token 合计，对齐 `TAB_BAR_PILL_TRACK_HEIGHT`。 */
export function tabBarTrackIntrinsicHeight(): number {
  const lineHeight = mobileTheme.typography.base['line-height-bar'] as number;
  return (
    TAB_BAR_INNER_PADDING * 2 +
    TAB_BAR_ITEM_PADDING_VERTICAL * 2 +
    TAB_BAR_ICON_SLOT +
    TAB_BAR_ITEM_GAP +
    lineHeight
  );
}

/** shell 上 + track + shell 下（不含 safe area）— 列表 bottom inset 用。 */
export function egTabBarScrollContentReserve(): number {
  return TAB_BAR_SHELL_PADDING_TOP + tabBarTrackIntrinsicHeight() + TAB_BAR_SHELL_PADDING_BOTTOM;
}

/** Android：浮动条总占位 = token shell + 系统底 inset（底壳渐变贴物理下沿）。 */
export function egTabBarScrollContentReserveWithSafeArea(safeAreaBottom = 0): number {
  const extension = Platform.OS === 'android' ? safeAreaBottom : 0;
  return egTabBarScrollContentReserve() + extension;
}

/** 浮动 pill（glass box + track）内容区高度 — token 推导，无固定 px。 */
export function egTabBarPillTrackHeight(): number {
  return tabBarTrackIntrinsicHeight();
}

/** EgTabBar shell 布局总高（上 + pill track + 下；不含宿主 safe area）。 */
export function egTabBarShellLayoutHeight(): number {
  return egTabBarScrollContentReserve();
}
