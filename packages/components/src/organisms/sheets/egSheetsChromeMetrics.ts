import { mobileTheme } from '../../theme/index.js';
import { egNavBarContentHeight } from '../tab-bar/nav-bar/egNavBarMetrics.js';

/** EgSheets 顶栏 · 上 / 左 / 右 spacing-4，按钮距卡片边恒定。 */
export const SHEETS_CHROME_PADDING = mobileTheme.spacing['spacing-4'] as number;
/** EgSheets 顶栏 · 下 spacing-2。 */
export const SHEETS_CHROME_PADDING_BOTTOM = mobileTheme.spacing['spacing-2'] as number;

/** iOS Sheet 拖拽指示条 · 宽 48 · 高 5（视觉规格，无独立 token）。 */
export const SHEETS_GRABBER_BAR_WIDTH = 48;
export const SHEETS_GRABBER_BAR_HEIGHT = 5;
export const SHEETS_GRABBER_PADDING_TOP = mobileTheme.spacing['spacing-2'] as number;

/** EgNavBar 内容区定高（边距 + 按钮行，不含状态栏）。 */
export function egSheetsNavBarContentHeight(): number {
  return egNavBarContentHeight(SHEETS_CHROME_PADDING, SHEETS_CHROME_PADDING_BOTTOM);
}

/** 顶栏 chrome 总高 · 与 NavBar 内容定高一致；拖拽条叠在卡片顶缘，不计入、不侵占顶边距。 */
export function egSheetsChromeHeight(_showDragIndicator?: boolean): number {
  return egSheetsNavBarContentHeight();
}