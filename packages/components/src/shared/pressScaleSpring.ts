import { EdsRecipeAnima } from '@eds/mobile-animations';

/** 纯对象 — 可在 Reanimated worklet / Gesture 处理器内直接使用。 */
function cloneSpringConfig(config: Record<string, number>) {
  return { ...config };
}

export const tapPressScaleInSpringConfig = cloneSpringConfig(
  EdsRecipeAnima('press').springConfig!,
);

/** 松手 scale→1 回弹 — 与按下档位 sm/md/lg/xl 无关，四档共用。 */
export const pressScaleOutSpringConfig = cloneSpringConfig(
  EdsRecipeAnima('press-scale-out').springConfig!,
);

/** Glass 按压与 press 共用 recipe press，待 glass Semantic 再分叉。 */
export const glassPressScaleInSpringConfig = tapPressScaleInSpringConfig;
