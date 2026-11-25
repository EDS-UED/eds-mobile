import { mobileTheme } from '../../theme/index.js';

const spacing = mobileTheme.spacing;

/** 分组卡片内边距 · `spacing-1`（4px）— 点按底缩进。 */
export const EG_ITEM_GROUP_INSET = spacing['spacing-1'] as number;

/** 分组卡片圆角 · `radius-lg`（20px）+ `borderCurve: continuous`。 */
export const EG_ITEM_GROUP_RADIUS = spacing['radius-lg'] as number;

/** 行左右内边距 · `spacing-4`（16px）。 */
export const EG_ITEM_PAD_H = spacing['spacing-4'] as number;

export type EgItemPadSize = 'sm' | 'md' | 'lg';

/** 行密度 · sm · `spacing-2`（8px）。 */
export const EG_ITEM_PAD_V_SM = spacing['spacing-2'] as number;

/** 行密度 · md · `spacing-3`（12px）。 */
export const EG_ITEM_PAD_V_MD = spacing['spacing-3'] as number;

/** 行密度 · lg · `spacing-4`（16px）· {@link EgItem} `padSize` 默认档。 */
export const EG_ITEM_PAD_V_LG = spacing['spacing-4'] as number;

/** 行默认上下内边距 · 等同 {@link EG_ITEM_PAD_V_LG}（Showcase 壳层对齐默认行）。 */
export const EG_ITEM_PAD_V = EG_ITEM_PAD_V_LG;

export function resolveEgItemPadVertical(size: EgItemPadSize = 'lg'): number {
  switch (size) {
    case 'sm':
      return EG_ITEM_PAD_V_SM;
    case 'md':
      return EG_ITEM_PAD_V_MD;
    default:
      return EG_ITEM_PAD_V_LG;
  }
}

/** 主文案单行行高 · `line-height-body-medium`（Showcase 壳参考，非行内 `minHeight`）。 */
export const EG_ITEM_LABEL_LINE_HEIGHT = mobileTheme.typography.base[
  'line-height-body-medium'
] as number;

/** 默认密度（lg）单行参考高 · Showcase 壳对齐；{@link EgItem} 无 `minHeight`。 */
export const EG_ITEM_MIN_HEIGHT =
  resolveEgItemPadVertical('lg') * 2 + EG_ITEM_LABEL_LINE_HEIGHT;

/** 点按底圆角 · `radius-md`（20px）+ `borderCurve: continuous`。 */
export const EG_ITEM_TAP_RADIUS = spacing['radius-md'] as number;

/** 图形与主文案间距 · `spacing-4`（16px）。 */
export const EG_ITEM_ICON_GAP = spacing['spacing-4'] as number;

/** 左侧图标槽宽 · `symbol-sm`。 */
export const EG_ITEM_ICON_SLOT = spacing['symbol-sm'] as number;

/** 右侧附属区间距 · `spacing-1-5`（6px）。 */
export const EG_ITEM_TRAILING_GAP = spacing['spacing-1-5'] as number;

/** 主文案与副文案间距 · `spacing-05`（2px）。 */
export const EG_ITEM_SUB_LABEL_GAP = spacing['spacing-05'] as number;

export function getEgItemDividerInset(hasLeadingGraphic: boolean): number {
  if (!hasLeadingGraphic) {
    return EG_ITEM_PAD_H;
  }
  return EG_ITEM_PAD_H + EG_ITEM_ICON_SLOT + EG_ITEM_ICON_GAP;
}