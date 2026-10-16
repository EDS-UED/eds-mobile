import { resolveMotionRecipe } from '@eds/mobile-animations';

/** 纯对象 — 可在 Reanimated worklet / Gesture 处理器内直接使用。 */
function cloneSpringConfig(config: Record<string, number>) {
  return { ...config };
}

export const tapPressScaleInSpringConfig = cloneSpringConfig(
  resolveMotionRecipe('press').springConfig!,
);

/** 松手 scale→1 回弹 — 与按下档位 sm/md/lg/xl 无关，四档共用。 */
export const pressScaleOutSpringConfig = cloneSpringConfig(
  resolveMotionRecipe('press-scale-out').springConfig!,
);

export const glassPressScaleInSpringConfig = cloneSpringConfig(
  resolveMotionRecipe('glass-press').springConfig!,
);

export const navigationSpringConfig = cloneSpringConfig(
  resolveMotionRecipe('navigation').springConfig!,
);
