import { Platform } from 'react-native';

import { egButtonGlassIconMinSize } from '../../../molecules/button/button-glass/_shared/resolveEgButtonGlassShellStyle.js';
import { mobileTheme } from '../../../theme/index.js';

const spacing = mobileTheme.spacing;
const isAndroid = Platform.OS === 'android';

export const EG_NAV_BAR_PADDING_HORIZONTAL = spacing['spacing-4'] as number;
/** iOS（RN）：上 spacing-05 · 下 spacing-2-5；Android：上下 spacing-2。 */
export const EG_NAV_BAR_PADDING_TOP = spacing[isAndroid ? 'spacing-2' : 'spacing-05'] as number;
export const EG_NAV_BAR_PADDING_BOTTOM = spacing[isAndroid ? 'spacing-2' : 'spacing-2-5'] as number;
/** 标题与左右操作的最小间距。 */
export const EG_NAV_BAR_TITLE_GAP = spacing['spacing-2'] as number;
/** `background="auto"`：内容滚入多少距离后背景完全显现。 */
export const EG_NAV_BAR_SCROLL_EDGE_DISTANCE = spacing['spacing-4'] as number;
export const EG_NAV_BAR_FADE_DURATION = mobileTheme.motion.timings['ios-ease-out'].duration as number;

/** 导航内容区高度（不含状态栏）— 上下 padding + icon 胶囊。 */
export function egNavBarContentHeight(): number {
  return EG_NAV_BAR_PADDING_TOP + EG_NAV_BAR_PADDING_BOTTOM + egButtonGlassIconMinSize();
}

/** 列表 `contentContainerStyle.paddingTop` — 状态栏区 + 导航内容区。 */
export function egNavBarScrollContentReserve(topInset: number): number {
  return topInset + egNavBarContentHeight();
}
