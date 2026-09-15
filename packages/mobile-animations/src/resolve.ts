import {
  mobileMotion,
  mobileMotionHaptics,
  mobileMotionRecipes,
  mobileMotionCompositions,
  mobileMotionSprings,
  mobileMotionTimings,
} from './generated/mobileMotion.generated.js';

export type MotionSpringName = keyof typeof mobileMotionSprings;
export type MotionTimingName = keyof typeof mobileMotionTimings;
export type MotionHapticName = keyof typeof mobileMotionHaptics;
export type MotionRecipeId = keyof typeof mobileMotionRecipes;
export type MotionCompositionId = keyof typeof mobileMotionCompositions;

/** Reanimated withSpring 配置 — 直接传入，禁止手写 damping/stiffness */
export function resolveMotionSpring(name: MotionSpringName) {
  return mobileMotion.spring[name];
}

/** Reanimated withTiming 配置 */
export function resolveMotionTiming(name: MotionTimingName) {
  return mobileMotion.timing[name];
}

/**
 * Recipe preset（spring / timing / haptic 已解析为可用对象）
 *
 * @example
 * const press = resolveMotionRecipe('press');
 * scale.value = withSpring(0.96, press.springConfig);
 */
export function resolveMotionRecipe(id: MotionRecipeId) {
  const recipe = mobileMotionRecipes[id];
  const springName = recipe.spring as MotionSpringName | null;
  const timingName = recipe.timing as MotionTimingName | null;
  const hapticName = recipe.haptic as MotionHapticName | null;

  return {
    id,
    label: recipe.label,
    semanticClass: recipe.semanticClass,
    velocityAware: recipe.velocityAware,
    interruptible: recipe.interruptible,
    springName,
    timingName,
    hapticName,
    springConfig: springName ? mobileMotion.spring[springName] : undefined,
    timingConfig: timingName ? mobileMotion.timing[timingName] : undefined,
    hapticType: hapticName ? mobileMotionHaptics[hapticName] : undefined,
  };
}

/** 多步场景编排（Sheet / Navigation / Transaction …）— consumer 优先用 composition，勿手拼 recipe */
export function resolveMotionComposition(id: MotionCompositionId) {
  return mobileMotionCompositions[id];
}
