import { EdsRecipeAnima, EdsSemanticAnima } from '@eds/mobile-animations';

import { mobileTheme } from '../theme/index.js';

/** 纯数值 spring — 可在 UI worklet / Gesture 内传给 `withSpring`。 */
export function cloneSpringConfig(config: Record<string, number> | undefined): Record<string, number> {
  if (!config) {
    return {};
  }
  const out: Record<string, number> = {};
  for (const key of Object.keys(config)) {
    const value = config[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      out[key] = value;
    }
  }
  return out;
}

/** 滑选跟手 · recipe drag → spring.drag（spec base → @eds/mobile-animations）。 */
export const slideFollowSpringConfig = cloneSpringConfig(EdsRecipeAnima('drag').springConfig!);

/**
 * 滑选落位 · EdsSemanticAnima('slide') + Base `spring.slide-commit`。
 * 物理量：`mobileTheme.motion.springByName['slide-commit']`（--motion-spring-slide-commit-damping 等）。
 */
export const slideCommitSpringConfig = {
  ...cloneSpringConfig(EdsSemanticAnima('slide').springConfig),
  ...cloneSpringConfig(mobileTheme.motion.springByName['slide-commit']),
};
