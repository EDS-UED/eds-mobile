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
} from './generated/mobileMotion.generated.js';

export {
  resolveMotionSpring,
  resolveMotionTiming,
  resolveMotionRecipe,
  resolveMotionComposition,
} from './resolve.js';
export type {
  MotionSpringName,
  MotionTimingName,
  MotionHapticName,
  MotionRecipeId,
  MotionCompositionId,
} from './resolve.js';

import {
  mobileMotionSprings,
  mobileMotionTimings,
} from './generated/mobileMotion.generated.js';

/** Back-compat named spring exports */
export const iosSpringInteractive = mobileMotionSprings.interactive;
export const iosSpringPress = mobileMotionSprings.press;
export const iosSpringControl = mobileMotionSprings.control;
export const iosSpringNavigation = mobileMotionSprings.navigation;
export const iosSpringModal = mobileMotionSprings.modal;
export const iosSpringSheet = mobileMotionSprings.sheet;
export const iosSpringDrag = mobileMotionSprings.drag;
export const iosSpringBouncy = mobileMotionSprings.bouncy;
export const iosSpringDefault = mobileMotionSprings.default;
export const iosSpringGentle = mobileMotionSprings.gentle;
export const iosSpringSnappy = mobileMotionSprings.snappy;

/** Back-compat named timing exports */
export const iosTimingNavigationPush = mobileMotionTimings.navigationPush;
export const iosTimingEaseInOut = mobileMotionTimings.easeInOut;
export const iosTimingEaseOut = mobileMotionTimings.easeOut;
export const iosTimingEaseIn = mobileMotionTimings.easeIn;

export { mobileMotion as default } from './generated/mobileMotion.generated.js';
