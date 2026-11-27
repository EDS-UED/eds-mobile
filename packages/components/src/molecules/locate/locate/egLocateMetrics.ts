import { mobileTheme } from '../../../theme/index.js';

const spacing = mobileTheme.spacing;

/** 索引相对屏幕右缘 · `spacing-1`（4px）。 */
export const EG_LOCATE_TRAILING_INSET = spacing['spacing-1'] as number;

/** 单个字母行高 · `spacing-4`（16px）。 */
export const EG_LOCATE_ITEM_HEIGHT = spacing['spacing-4'] as number;

/** 拖拽气泡与索引轨水平间距 · `spacing-2`（8px）。 */
export const EG_LOCATE_BUBBLE_GAP = spacing['spacing-2'] as number;