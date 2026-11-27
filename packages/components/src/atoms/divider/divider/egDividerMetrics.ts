import { StyleSheet } from 'react-native';

import { mobileTheme } from '../../../theme/index.js';

/** Module / Page 线宽 — `--stroke-xs` / `mobileTheme.spacing['stroke-xs']`。 */
export const EG_DIVIDER_STROKE_THICKNESS_PX = mobileTheme.spacing['stroke-xs'] as number;

/** 垂直预览 / 无 flex 父级时的默认长度（长轴）。 */
export const EG_DIVIDER_DEFAULT_VERTICAL_LENGTH_PX = mobileTheme.spacing['spacing-20'] as number;

/** Token `stroke-xs` 可能低于 RN 物理最小线宽，layout 用 hairline 保底。 */
export function egDividerStrokeLayoutThickness(): number {
  const spec = EG_DIVIDER_STROKE_THICKNESS_PX;
  const hairline = StyleSheet.hairlineWidth;
  return spec > 0 && spec < hairline ? hairline : spec;
}

/** `EgDividerEnd` 中线点直径 · `spacing-1`（4px）。 */
export const EG_DIVIDER_END_DOT_SIZE = mobileTheme.spacing['spacing-1'] as number;

/** `EgDividerEnd` 左右线与中线点间距 · `spacing-2`（8px）。 */
export const EG_DIVIDER_END_GAP = mobileTheme.spacing['spacing-2'] as number;
