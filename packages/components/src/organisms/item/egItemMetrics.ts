import { mobileTheme } from '../../theme/index.js';

const spacing = mobileTheme.spacing;

/** 分组卡片内边距 · `spacing-1`（4px）— 点按底缩进。 */
export const EG_ITEM_GROUP_INSET = spacing['spacing-1'] as number;

/** 分组卡片圆角 · `radius-lg`（20px）+ `borderCurve: continuous`。 */
export const EG_ITEM_GROUP_RADIUS = spacing['radius-lg'] as number;

/** 行左右内边距 · `spacing-4`（16px）。 */
export const EG_ITEM_PAD_H = spacing['spacing-4'] as number;

/** 行上下内边距 · `spacing-4`（16px）。 */
export const EG_ITEM_PAD_V = spacing['spacing-4'] as number;

/** 最小行高 · `input-md`。 */
export const EG_ITEM_MIN_HEIGHT = spacing['input-md'] as number;

/** 点按底圆角 · `radius-md` + continuous。 */
export const EG_ITEM_TAP_RADIUS = spacing['radius-md'] as number;

/** 图形与主文案间距 · `spacing-4`（16px）。 */
export const EG_ITEM_ICON_GAP = spacing['spacing-4'] as number;

/** 左侧图标槽宽 · `symbol-sm`。 */
export const EG_ITEM_ICON_SLOT = spacing['symbol-sm'] as number;

/** 右侧附属区间距 · `spacing-1-5`（6px）。 */
export const EG_ITEM_TRAILING_GAP = spacing['spacing-1-5'] as number;

export function getEgItemDividerInset(hasLeadingGraphic: boolean): number {
  if (!hasLeadingGraphic) {
    return EG_ITEM_PAD_H;
  }
  return EG_ITEM_PAD_H + EG_ITEM_ICON_SLOT + EG_ITEM_ICON_GAP;
}