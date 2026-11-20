/** EDS Mobile motion — generated from packages/tokens/spec/motion */
export {
  mobileMotion,
  mobileMotionSprings,
  mobileMotionTimings,
  mobileMotionHaptics,
  mobileMotionInteraction,
  mobileMotionRecipes,
  mobileMotionCompositions,
  mobileMotionSemanticMap,
  mobileMotionScenarioById,
} from './generated/mobileMotion.generated.js';

export {
  resolveMotionSpring,
  resolveMotionTiming,
  EdsRecipeAnima,
  EdsSemanticAnima,
  resolveMotionComposition,
} from './resolve.js';
export type {
  MotionSpringName,
  MotionTimingName,
  MotionHapticName,
  MotionRecipeId,
  EdsRecipeAnimaId,
  EdsSemanticScenarioId,
  MotionSemanticClassName,
  MotionCompositionId,
} from './resolve.js';

import {
  mobileMotionSprings,
} from './generated/mobileMotion.generated.js';

/** Back-compat named spring exports（与 spec springs 同步） */
export const iosSpringPress = mobileMotionSprings.press;
export const iosSpringPressRelease = mobileMotionSprings['press-release'];
export const iosSpringControl = mobileMotionSprings.control;
export const iosSpringSlideCommit = mobileMotionSprings['slide-commit'];
export const iosSpringDrag = mobileMotionSprings.drag;
export const iosSpringSnappy = mobileMotionSprings.snappy;

export { mobileMotion as default } from './generated/mobileMotion.generated.js';

export {
  EgVerifyRingDots,
  EgDoneTick,
  EgMotionProcessing,
  EgRipplePulse,
  EgOdometer,
  EgMnemonicVerify,
  sceneMaterialBrand,
  sceneMaterialBasePrimary,
  sceneStatusSuccess,
  sceneStatusWarning,
} from './scene/index.js';
export type {
  EgVerifyRingDotsProps,
  EgDoneTickProps,
  EgMotionProcessingProps,
  EgRipplePulseProps,
  EgOdometerProps,
  EgMnemonicVerifyProps,
  SceneThemeMode,
} from './scene/index.js';
export {
  VERIFY_RING_DEFAULT_SIZE,
  DONE_TICK_SIZE,
  MOTION_PROCESSING_DEFAULT_SIZE,
  RIPPLE_PULSE_DEFAULT_SIZE,
} from './scene/index.js';
