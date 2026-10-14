import { mobileTheme } from '../theme/index.js';

/** Disabled control opacity — motion-opacity-disabled. */
export function disabledOpacity(): number {
  return mobileTheme.motion.opacity['opacity-disabled'] as number;
}

/** Press scale — motion-scale-press. */
export function motionPressScale(): number {
  return mobileTheme.motion.scale['scale-press'] as number;
}

/** Glass press scale — motion-glass-scale-press. */
export function motionGlassPressScale(): number {
  return mobileTheme.motion.scale['glass-scale-press'] as number;
}

/** Icon container label font size ratio (55% of icon size). */
export function iconContainerLabelScale(): number {
  return 0.55;
}
