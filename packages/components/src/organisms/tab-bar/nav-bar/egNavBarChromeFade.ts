import { Easing } from 'react-native-reanimated';

import { resolveFadeMotionTokens } from '../../../shared/motion/fadeMotionTokens.js';

function bezierFromCss(cubicBezier: string): [number, number, number, number] {
  const match = /cubic-bezier\(\s*([^)]+)\s*\)/.exec(cubicBezier);
  const parts = match?.[1]?.split(',').map((part) => Number.parseFloat(part.trim()));
  return parts && parts.length === 4 && parts.every((value) => Number.isFinite(value))
    ? (parts as [number, number, number, number])
    : [0.42, 0, 0.58, 1];
}

/** RN 栏 Chrome（标题 / 槽位 / 手控背景）— EdsSemanticAnima('fade')。 */
export function egNavBarChromeFadeTiming() {
  const tokens = resolveFadeMotionTokens();
  const easing = Easing.bezier(...bezierFromCss(tokens.opacityEasing));
  return { duration: tokens.opacityDurationMs, easing };
}

let chromeFadeCached: ReturnType<typeof egNavBarChromeFadeTiming> | null = null;

export function getEgNavBarChromeFade() {
  chromeFadeCached ??= egNavBarChromeFadeTiming();
  return chromeFadeCached;
}