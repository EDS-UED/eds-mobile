import { EdsRecipeAnima, EdsSemanticAnima } from '@eds/mobile-animations';
import { Easing } from 'react-native-reanimated';

import { mobileTheme } from '../../theme/index.js';
import { cloneSpringConfig } from '../slideMotion.js';

/** Sheet 呈现 · EdsSemanticAnima('sheets') → spring.sheets-present。 */
export const sheetsPresentSpringConfig = cloneSpringConfig(EdsSemanticAnima('sheets').springConfig);

/** 档位吸附 · EdsRecipeAnima('sheets-detent') → spring.sheets-detent。 */
export const sheetsDetentSpringConfig = cloneSpringConfig(EdsRecipeAnima('sheets-detent').springConfig);

const dismissTiming = EdsRecipeAnima('sheets-dismiss').timingConfig;
const dismissEasing = Array.isArray(dismissTiming?.easing) ? dismissTiming.easing : null;

/** 收起 · EdsRecipeAnima('sheets-dismiss') → timing.sheets-dismiss（定时下滑，无弹簧）。 */
export const sheetsDismissTimingConfig = {
  duration: dismissTiming?.duration ?? 800,
  easing: dismissEasing
    ? Easing.bezier(dismissEasing[0]!, dismissEasing[1]!, dismissEasing[2]!, dismissEasing[3]!)
    : Easing.bezier(0.32, 0.72, 0, 1),
};

/** Base `motion-offset-sheets-inset` → spacing-2。 */
export const sheetsInset =
  mobileTheme.motion.offset['offset-sheets-inset'] ??
  (mobileTheme.spacing['spacing-2'] as number);
/** Base `motion-offset-sheets-top` · spec `var(--spacing-0)` — large 档顶边距系统条（safe area top）。 */
export const sheetsTopOffset =
  mobileTheme.motion.offset['offset-sheets-top'] ??
  (mobileTheme.spacing['spacing-0'] as number);
/** Base `motion-radius-sheets-floating` → radius-2xl（glass-sheets-box）。 */
export const sheetsFloatingRadius =
  mobileTheme.motion.radius['radius-sheets-floating'] ??
  (mobileTheme.spacing['radius-2xl'] as number);
/** Base `motion-radius-sheets-attached` → radius-2xl。 */
export const sheetsAttachedRadius =
  mobileTheme.motion.radius['radius-sheets-attached'] ??
  (mobileTheme.spacing['radius-2xl'] as number);
/** Base `motion-opacity-sheets-dim-floating`。 */
export const sheetsDimFloating = mobileTheme.motion.opacity['opacity-sheets-dim-floating'] ?? 0.4;

export type SheetsFrameTokens = {
  inset: number;
  floatingRadius: number;
  attachedRadius: number;
  dimFloating: number;
};

export const sheetsFrameTokens: SheetsFrameTokens = {
  inset: sheetsInset,
  floatingRadius: sheetsFloatingRadius,
  attachedRadius: sheetsAttachedRadius,
  dimFloating: sheetsDimFloating,
};

/**
 * Sheet 几何 · 由当前高度连续推导（iOS 27）：
 * `attachFrom`（最高部分档）以下为悬浮卡片；到 `attachTo`（全高档）时 inset → 0、底角 → 0、顶角 → attached。
 */
export function sheetsFrame(
  height: number,
  attachFrom: number,
  attachTo: number,
  tokens: SheetsFrameTokens,
) {
  'worklet';
  const span = Math.max(1, attachTo - attachFrom);
  const linear = Math.min(1, Math.max(0, (height - attachFrom) / span));
  const t = linear * linear * (3 - 2 * linear);
  const inset = tokens.inset * (1 - t);
  return {
    attach: t,
    inset,
    topRadius: tokens.floatingRadius + (tokens.attachedRadius - tokens.floatingRadius) * t,
    bottomRadius: tokens.floatingRadius * (1 - t),
    dim: tokens.dimFloating + (1 - tokens.dimFloating) * t,
  };
}

/** 松手速度投影后取最近档位（velocityY 向下为正，单位 px/s）。 */
export function resolveSheetsDetentIndex(
  height: number,
  velocityY: number,
  detents: readonly number[],
): number {
  'worklet';
  const projected = height - velocityY * 0.15;
  let best = 0;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (let i = 0; i < detents.length; i += 1) {
    const distance = Math.abs(detents[i]! - projected);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = i;
    }
  }
  return best;
}
