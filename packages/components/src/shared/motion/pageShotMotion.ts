import { EdsRecipeAnima, EdsSemanticAnima } from '@eds/mobile-animations';

import { mobileTheme } from '../../theme/index.js';
import { cloneSpringConfig } from '../slideMotion.js';

const shotRatio = (key: string, fallback: number) => mobileTheme.motion.ratio[key] ?? fallback;

/** 卡片展开整页 · EdsSemanticAnima('page-shot') → spring.page-shot-open。 */
export const pageShotOpenSpringConfig = cloneSpringConfig(EdsSemanticAnima('page-shot').springConfig);

/** 关闭 / 下拉收起飞回卡片 · EdsRecipeAnima('page-shot-dismiss') → spring.page-shot-close。 */
export const pageShotCloseSpringConfig = cloneSpringConfig(
  EdsRecipeAnima('page-shot-dismiss').springConfig,
);

/** Base `motion-ratio-page-shot-close-launch` — 收回起步速度（progress / s），离场先快后慢。 */
export const pageShotCloseLaunchVelocity = shotRatio('ratio-page-shot-close-launch', 12);
/** Base `motion-opacity-page-shot-dim`（× material-same-black）。 */
export const pageShotDimOpacity = mobileTheme.motion.opacity['opacity-page-shot-dim'] ?? 0.8;
/** Base `motion-scale-page-shot-dismiss` — 下拉跟手最小缩放。 */
export const pageShotDismissScale = mobileTheme.motion.scale['scale-page-shot-dismiss'] ?? 0.82;
/** Base `motion-radius-page-shot` → radius-2xl（下拉跟手整页圆角）。 */
export const pageShotDragRadius =
  mobileTheme.motion.radius['radius-page-shot'] ??
  (mobileTheme.spacing['radius-2xl'] as number);

/** `motion-ratio-page-shot-morph` */
export const pageShotMorphProgressRatio = shotRatio('ratio-page-shot-morph', 0.3);
/** `motion-ratio-page-shot-body-in-start` */
export const pageShotBodyInStartRatio = shotRatio('ratio-page-shot-body-in-start', 0.55);
/** `motion-ratio-page-shot-body-in-span` */
export const pageShotBodyInSpanRatio = shotRatio('ratio-page-shot-body-in-span', 0.45);
/** `motion-ratio-page-shot-land` */
export const pageShotLandRatio = shotRatio('ratio-page-shot-land', 0.5);
/** `motion-ratio-page-shot-drag-range` */
export const pageShotDragRangeRatio = shotRatio('ratio-page-shot-drag-range', 0.35);
/** `motion-ratio-page-shot-dismiss-drag-distance` */
export const pageShotDismissDragDistanceRatio = shotRatio('ratio-page-shot-dismiss-drag-distance', 0.15);
/** `motion-ratio-page-shot-scroll-retreat-power` */
export const pageShotScrollRetreatPower = shotRatio('ratio-page-shot-scroll-retreat-power', 1.22);

/**
 * page-shot 收回参数 · **EDS 内部**（`EgEdsAnimaPageShot` / `EgPageShotScroll`）；
 * 业务不引用，手感改 `spec/motion` 的 `motion-ratio-page-shot-*`。
 * @internal
 */
export const pageShotRecover = {
  openSpring: pageShotOpenSpringConfig,
  closeSpring: pageShotCloseSpringConfig,
  closeLaunchVelocity: pageShotCloseLaunchVelocity,
  dimOpacity: pageShotDimOpacity,
  dismissScale: pageShotDismissScale,
  dragRadius: pageShotDragRadius,
  morphProgress: pageShotMorphProgressRatio,
  bodyInStart: pageShotBodyInStartRatio,
  bodyInSpan: pageShotBodyInSpanRatio,
  landRatio: pageShotLandRatio,
  dragRangeRatio: pageShotDragRangeRatio,
  dismissDragDistanceRatio: pageShotDismissDragDistanceRatio,
  scrollRetreatPower: pageShotScrollRetreatPower,
} as const;

export type PageShotRect = { x: number; y: number; width: number; height: number };

/**
 * 收回中与 `pageShotProgressSv` 同轨的滚动 offset（`EgPageShotScroll` 专用）。
 * @internal
 */
export function resolvePageShotCloseScrollY(
  fromY: number,
  progress: number,
  progressAtCloseStart: number,
): number {
  'worklet';
  if (fromY <= 0) return 0;
  const start = Math.max(1e-4, progressAtCloseStart);
  const t = Math.min(1, Math.max(0, progress / start));
  return fromY * t ** pageShotScrollRetreatPower;
}

export function resolvePageShotDragRange(pageHeight: number): number {
  return pageHeight * pageShotDragRangeRatio;
}

export function resolvePageShotDismissDragDistance(pageHeight: number): number {
  return pageHeight * pageShotDismissDragDistanceRatio;
}

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
  const land = progress < 0 ? 1 + progress * pageShotLandRatio : 1;
  const t = Math.max(0, progress);
  const width = (source.width + (pageWidth - source.width) * t) * land;
  const height = (source.height + (pageHeight - source.height) * t) * land;
  const d = Math.min(1, Math.max(0, drag)) * p;
  const bodySpan = Math.max(1e-4, pageShotBodyInSpanRatio);
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
    bodyOpacity: Math.min(1, Math.max(0, (p - pageShotBodyInStartRatio) / bodySpan)),
  };
}