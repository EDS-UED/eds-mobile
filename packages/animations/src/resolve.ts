import {
  mobileMotion,
  mobileMotionHaptics,
  mobileMotionRecipes,
  mobileMotionCompositions,
  mobileMotionSemanticMap,
  mobileMotionScenarioById,
  mobileMotionSprings,
  mobileMotionTimings,
} from './generated/mobileMotion.generated.js';

export type MotionSpringName = keyof typeof mobileMotionSprings;
export type MotionTimingName = keyof typeof mobileMotionTimings;
export type MotionHapticName = keyof typeof mobileMotionHaptics;
export type MotionRecipeId = keyof typeof mobileMotionRecipes;
export type MotionCompositionId = keyof typeof mobileMotionCompositions;
export type MotionSemanticClassName = keyof typeof mobileMotionSemanticMap;

/** {@link EdsRecipeAnima} — spec `namedRecipes[].id`（如 `press`）。 */
export type EdsRecipeAnimaId = MotionRecipeId;

/** {@link EdsSemanticAnima} — spec `scenarioId`（默认 `motion-*` 去前缀）。 */
export type EdsSemanticScenarioId = keyof typeof mobileMotionScenarioById;

/** Reanimated withSpring 配置 — 直接传入，禁止手写 damping/stiffness */
export function resolveMotionSpring(name: MotionSpringName) {
  return mobileMotion.spring[name];
}

/** Reanimated withTiming 配置 */
export function resolveMotionTiming(name: MotionTimingName) {
  return mobileMotion.timing[name];
}

/**
 * Recipe 层 — 组合 Base 参数（id = spec `namedRecipes[].id`）。
 *
 * @example 点按缩放弹簧
 * EdsRecipeAnima('press').springConfig
 */
export function EdsRecipeAnima(id: MotionRecipeId) {
  return resolveMotionRecipe(id);
}

function resolveSemanticClassName(
  scenario: EdsSemanticScenarioId | MotionSemanticClassName,
): MotionSemanticClassName | null {
  if (scenario in mobileMotionSemanticMap) {
    return scenario as MotionSemanticClassName;
  }
  if (scenario in mobileMotionScenarioById) {
    return mobileMotionScenarioById[scenario as EdsSemanticScenarioId] as MotionSemanticClassName;
  }
  const prefixed = `motion-${scenario}` as MotionSemanticClassName;
  if (prefixed in mobileMotionSemanticMap) {
    return prefixed;
  }
  return null;
}

/**
 * Semantic 层 — 场景动效（class `.motion-*` 的 RN 入口；内部解析 Recipe + spring/timing）。
 *
 * @example 点按缩放（`.motion-press` · `EdsSemanticAnima('press')`）
 * EdsSemanticAnima('press')
 */
export function EdsSemanticAnima(scenario: EdsSemanticScenarioId) {
  const semanticClass = resolveSemanticClassName(scenario);
  if (!semanticClass) {
    throw new Error(`EdsSemanticAnima: unknown scenario '${scenario}'`);
  }
  const entry = mobileMotionSemanticMap[semanticClass] as {
    recipe?: MotionRecipeId | null;
    spring?: MotionSpringName | null;
    timing?: MotionTimingName | null;
  };
  const recipeId = entry.recipe ?? null;
  const recipe = recipeId ? resolveMotionRecipe(recipeId) : undefined;
  const springName = entry.spring as MotionSpringName | null;
  const timingName = entry.timing as MotionTimingName | null;

  return {
    scenario,
    semanticClass,
    recipeId: recipeId ?? null,
    recipe,
    springName,
    timingName,
    springConfig: springName ? mobileMotion.spring[springName] : recipe?.springConfig,
    timingConfig: timingName ? mobileMotion.timing[timingName] : recipe?.timingConfig,
    hapticType: recipe?.hapticType,
  };
}

/**
 * @internal
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
