import { Easing } from 'react-native-reanimated';

import { resolveDeformMotionTokens } from '../../../shared/motion/deformMotionTokens.js';

function reanimatedBezier(cubicBezier: string) {
  const match = /cubic-bezier\(\s*([^)]+)\s*\)/.exec(cubicBezier);
  const parts = match?.[1]?.split(',').map((part) => Number.parseFloat(part.trim()));
  if (parts && parts.length === 4 && parts.every((value) => Number.isFinite(value))) {
    return Easing.bezier(parts[0], parts[1], parts[2], parts[3]);
  }
  return Easing.bezier(0.42, 0, 0.58, 1);
}

/** 输入框宽度 · `EdsSemanticAnima('deform')` 几何 timing。 */
export function resolveEgSearchDeformMotion() {
  const deform = resolveDeformMotionTokens();
  return {
    geometryTiming: {
      duration: deform.geometryDurationMs,
      easing: reanimatedBezier(deform.geometryEasing),
    },
  };
}
