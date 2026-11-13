import { EdsRecipeAnima, EdsSemanticAnima } from '@eds/mobile-animations';

import { mobileTheme } from '../../theme/index.js';
import { cloneSpringConfig } from '../slideMotion.js';

/** 推入 · EdsSemanticAnima('page') → spring.page-push（轻过冲回弹）。 */
export const pagePushSpringConfig = cloneSpringConfig(EdsSemanticAnima('page').springConfig);

/** 返回 · EdsRecipeAnima('page-back') → spring.page-pop（侧滑松手继承速度）。 */
export const pageBackSpringConfig = cloneSpringConfig(EdsRecipeAnima('page-back').springConfig);

/** Base `motion-ratio-page-parallax` — 下层页视差位移 = 容器宽 × ratio。 */
export const pageParallaxRatio = mobileTheme.motion.ratio['ratio-page-parallax'] ?? 0.3;

/** Base `motion-opacity-page-dim` — 被覆盖页压暗（× material-same-black）。 */
export const pageDimOpacity = mobileTheme.motion.opacity['opacity-page-dim'] ?? 0.2;

/** spring 过冲时页面两侧外扩背景比例（容器宽 ×），覆盖 ≈ 1.5% 过冲并留余量。 */
export const PAGE_OVERSHOOT_BLEED_RATIO = 0.06;

/**
 * 页面切换几何 · `progress` 0 = 下层页在位，1 = 上层（新）页在位；spring 过冲时可略超出 [0, 1]。
 * 上层页自右推入，下层页同步视差左移并压暗。
 */
export function pageTransitionFrame(progress: number, width: number) {
  'worklet';
  const dimProgress = Math.min(1, Math.max(0, progress));
  return {
    topTranslateX: (1 - progress) * width,
    underTranslateX: -progress * width * pageParallaxRatio,
    underDim: dimProgress * pageDimOpacity,
  };
}

/** 侧滑返回松手 · 速度投影（px/s → 约 0.2s 后的位移）超过半宽即返回。 */
export function pageShouldCommitBack(translationX: number, velocityX: number, width: number) {
  'worklet';
  return translationX + velocityX * 0.2 > width / 2;
}
