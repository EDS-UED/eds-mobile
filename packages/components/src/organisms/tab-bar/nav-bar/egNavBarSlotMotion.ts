import { Easing, Keyframe } from 'react-native-reanimated';

import { resolveLayoutContentMotionTokens } from '../../../shared/motion/layoutContentMotionTokens.js';

/** 槽位入场起始缩放 — 与 iOS 导航栏按钮切换观感一致。 */
const SLOT_ENTER_SCALE = 0.86;

function bezierFromCss(cubicBezier: string): [number, number, number, number] {
  const match = /cubic-bezier\(\s*([^)]+)\s*\)/.exec(cubicBezier);
  const parts = match?.[1]?.split(',').map((part) => Number.parseFloat(part.trim()));
  return parts && parts.length === 4 && parts.every((value) => Number.isFinite(value))
    ? (parts as [number, number, number, number])
    : [0.42, 0, 0.58, 1];
}

function createSlotMotion() {
  const tokens = resolveLayoutContentMotionTokens();
  const duration = tokens.transformDurationMs;
  const opacityEasing = Easing.bezier(...bezierFromCss(tokens.opacityEasing));
  const transformEasing = Easing.bezier(...bezierFromCss(tokens.transformEasing));
  /** opacity 时长（layout-deform-content-opacity）在 transform 总时长内的进度点。 */
  const opacityStop = Math.min(100, Math.round((tokens.opacityDurationMs / duration) * 100));

  const entering = new Keyframe({
    0: { opacity: tokens.opacityHidden, transform: [{ scale: SLOT_ENTER_SCALE }] },
    [opacityStop]: { opacity: tokens.opacityVisible, easing: opacityEasing },
    100: { opacity: tokens.opacityVisible, transform: [{ scale: 1 }], easing: transformEasing },
  }).duration(duration);

  const exiting = new Keyframe({
    0: { opacity: tokens.opacityVisible, transform: [{ scale: 1 }] },
    [opacityStop]: { opacity: tokens.opacityHidden, easing: opacityEasing },
    100: { opacity: tokens.opacityHidden, transform: [{ scale: SLOT_ENTER_SCALE }], easing: transformEasing },
  }).duration(duration);

  /** 槽位宽度 / 靠左标题边距 — 与 transform 同档（layout-deform-content-transform）。 */
  const timing = { duration, easing: transformEasing };

  return { entering, exiting, timing };
}

let cached: ReturnType<typeof createSlotMotion> | null = null;

/** `slotTransition="layout"` · Semantic layout-deform-content：操作 crossfade + 缩放，槽位宽度与标题随之平移。 */
export function egNavBarSlotMotion() {
  cached ??= createSlotMotion();
  return cached;
}
