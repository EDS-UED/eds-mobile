import { EdsRecipeAnima, EdsSemanticAnima } from '@eds/mobile-animations';

import { mobileTheme } from '../../theme/index.js';
import { cloneSpringConfig } from '../slideMotion.js';

/** 卡片展开整页 · EdsSemanticAnima('page-shot') → spring.page-shot-open。 */
export const pageShotOpenSpringConfig = cloneSpringConfig(EdsSemanticAnima('page-shot').springConfig);

/** 关闭 / 下拉收起飞回卡片 · EdsRecipeAnima('page-shot-dismiss') → spring.page-shot-close。 */
export const pageShotCloseSpringConfig = cloneSpringConfig(
  EdsRecipeAnima('page-shot-dismiss').springConfig,
);

/** Base `motion-ratio-page-shot-close-launch` — 收回起步速度（progress / s），离场先快后慢。 */
export const pageShotCloseLaunchVelocity =
  mobileTheme.motion.ratio['ratio-page-shot-close-launch'] ?? 12;
/** Base `motion-opacity-page-shot-dim`（× material-same-black）。 */
export const pageShotDimOpacity = mobileTheme.motion.opacity['opacity-page-shot-dim'] ?? 0.8;
/** Base `motion-scale-page-shot-dismiss` — 下拉跟手最小缩放。 */
export const pageShotDismissScale = mobileTheme.motion.scale['scale-page-shot-dismiss'] ?? 0.82;
/** Base `motion-radius-page-shot` → radius-2xl（下拉跟手整页圆角）。 */
export const pageShotDragRadius =
  mobileTheme.motion.radius['radius-page-shot'] ??
  (mobileTheme.spacing['radius-2xl'] as number);

export type PageShotRect = { x: number; y: number; width: number; height: number };

/** 收回落位回弹（progress < 0）· 按触发元素自身尺寸绕中心微缩，非按整页距离外推（小触发元素不被压扁）。 */
const PAGE_SHOT_LAND_RATIO = 0.5;

/**
 * 触发元素 frame ↔ 整页几何（卡片 / 按钮 / 列表行…同一动效）· `progress` 0 = 触发元素 frame，
 * 1 = 整页（spring 过冲可略超出）；`drag` 0…1 = 下拉 / 侧滑跟手量。
 * 内容按整页宽排版，随 frame 宽等比缩放并顶部对齐（卡片即整页顶部区域）。
 */
export function pageShotFrame(
  progress: number,
  drag: number,
  source: PageShotRect,
  pageWidth: number,
  pageHeight: number,
  sourceRadius: number,
) {
  'worklet';
  const p = Math.min(1, Math.max(0, progress));
  const land = progress < 0 ? 1 + progress * PAGE_SHOT_LAND_RATIO : 1;
  const t = Math.max(0, progress);
  const width = (source.width + (pageWidth - source.width) * t) * land;
  const height = (source.height + (pageHeight - source.height) * t) * land;
  const d = Math.min(1, Math.max(0, drag)) * p;
  return {
    left: source.x * (1 - t) + (source.width * (1 - land)) / 2,
    top: source.y * (1 - t) + (source.height * (1 - land)) / 2,
    width,
    height,
    scale: 1 - (1 - pageShotDismissScale) * d,
    borderRadius: Math.max(sourceRadius * (1 - p), pageShotDragRadius * d),
    contentScale: width / pageWidth,
    /** 收回落位回弹缩放（≤ 1）· 触发元素外观按自身尺寸绕中心微缩。 */
    land,
    dim: p * pageShotDimOpacity,
    /** 展开后段淡入（卡片外的正文）。 */
    bodyOpacity: Math.min(1, Math.max(0, (p - 0.55) / 0.45)),
  };
}
