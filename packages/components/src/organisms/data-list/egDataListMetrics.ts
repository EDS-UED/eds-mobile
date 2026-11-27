import type { ViewStyle } from 'react-native';

import { mobileTheme } from '../../theme/index.js';

const spacing = mobileTheme.spacing;

/** Data list 点按缩放默认 · `scale-press-down-xs`。 */
export const EG_DATA_LIST_PRESS_INTENSITY = 'xs' as const;

/** Scene 默认水平边距 · `spacing-5`（20px）· 列表 DL-bleed 基准。 */
export const EG_DATA_LIST_SCENE_CONTENT_INSET = spacing['spacing-5'] as number;

/** 点按底圆角 · token `radius-md`（`--radius-md` · 20px）+ `borderCurve: continuous`。 */
export const EG_DATA_LIST_ROW_RADIUS = spacing['radius-md'] as number;

/** 行与行间距 · token `spacing-1`（4px）· `EgDataList` 容器 `gap`。 */
export const EG_DATA_LIST_ROW_GAP = spacing['spacing-1'] as number;

/** 行内边距上下 · `spacing-3`（12px）· 参与行高，非固定行高 token。 */
export const EG_DATA_LIST_ROW_PAD_V = spacing['spacing-3'] as number;

/** 行内边距左右 · `spacing-3`（12px）。 */
export const EG_DATA_LIST_ROW_PAD_H = spacing['spacing-3'] as number;

/** 行壳水平外边距 · `spacing-2`（8px）。 */
export const EG_DATA_LIST_ROW_MARGIN_H = spacing['spacing-2'] as number;

/** 图形插槽与文本列间距 · `spacing-3`（12px）。 */
export const EG_DATA_LIST_GRAPHIC_TEXT_GAP = spacing['spacing-3'] as number;

/** 主文本与紧跟其后的 Tag 间距 · `spacing-1`（4px）。 */
export const EG_DATA_LIST_PRIMARY_TAG_GAP = spacing['spacing-1'] as number;

/** 文本列 ↔ 右侧内容插槽 · `spacing-3`（12px）。 */
export const EG_DATA_LIST_CONTENT_SLOT_GAP = spacing['spacing-3'] as number;

/** 副文本最多行数 · 超出换行，末行溢出 `…`。 */
export const EG_DATA_LIST_SUB_TEXT_MAX_LINES = 2;

/**
 * 行高语义：`EG_DATA_LIST_ROW_PAD_V` × 2 + `children`（插槽）实测高度。
 * `EgDataListRow` 不设 `minHeight` / 固定 `height`。
 */

export type EgDataListRowLayout = {
  padH: number;
  padV: number;
  marginH: number;
  /** 图形 ↔ 文本 · {@link EG_DATA_LIST_GRAPHIC_TEXT_GAP}。 */
  contentGap: number;
  /** 文本/挂件 ↔ 右侧内容插槽 · {@link EG_DATA_LIST_CONTENT_SLOT_GAP}。 */
  contentSlotGap: number;
  contentInsetFromScreen: number;
  borderRadius: number;
  slack: number;
  sceneInset: number;
  titleSubGap: number;
};

export function getEgDataListRowLayout(
  sceneContentInset: number = EG_DATA_LIST_SCENE_CONTENT_INSET,
): EgDataListRowLayout {
  const padH = EG_DATA_LIST_ROW_PAD_H;
  const padV = EG_DATA_LIST_ROW_PAD_V;
  const marginH = EG_DATA_LIST_ROW_MARGIN_H;
  const contentGap = EG_DATA_LIST_GRAPHIC_TEXT_GAP;
  const titleSubGap = spacing['spacing-05'] as number;
  return {
    padH,
    padV,
    marginH,
    contentGap,
    contentSlotGap: EG_DATA_LIST_CONTENT_SLOT_GAP,
    borderRadius: EG_DATA_LIST_ROW_RADIUS,
    slack: 0,
    sceneInset: sceneContentInset,
    contentInsetFromScreen: marginH + padH,
    titleSubGap,
  };
}

/** 行与行 · {@link EG_DATA_LIST_ROW_GAP}。 */
export function egDataListRowGap(): number {
  return EG_DATA_LIST_ROW_GAP;
}

/** DL-bleed · 抵消父级 Scene `spacing-5` · 行间 `gap` 默认 {@link EG_DATA_LIST_ROW_GAP}。 */
export function egDataListSectionStyle(
  sceneContentInset: number = EG_DATA_LIST_SCENE_CONTENT_INSET,
  rowGap: number = EG_DATA_LIST_ROW_GAP,
): ViewStyle {
  return {
    marginHorizontal: -sceneContentInset,
    alignSelf: 'stretch',
    overflow: 'visible',
    gap: rowGap,
  };
}