import { mobileTheme } from '../../theme/index.js';

function readMotionTiming(iosKey: string) {
  const timing = mobileTheme.motion.timings[iosKey];
  if (!timing?.duration) {
    throw new Error(`layoutContentMotion: missing mobileTheme.motion.timings['${iosKey}']`);
  }
  return timing;
}

export function resolveLayoutContentMotionTokens() {
  const opacityTiming = readMotionTiming('ios-layout-deform-content-opacity');
  const transformTiming = readMotionTiming('ios-layout-deform-content-transform');
  const swapTiming = readMotionTiming('ios-layout-deform-content-swap');
  const offsetY = mobileTheme.spacing['spacing-2-5'] as number;

  return {
    swapMs: swapTiming.duration as number,
    offsetY,
    opacityVisible: mobileTheme.motion.opacity['opacity-visible'] ?? 1,
    opacityHidden: mobileTheme.motion.opacity['opacity-hidden'] ?? 0,
    opacityDurationMs: opacityTiming.duration as number,
    transformDurationMs: transformTiming.duration as number,
    opacityEasing: opacityTiming.easing ?? 'cubic-bezier(0.42,0,0.58,1)',
    transformEasing: transformTiming.easing ?? 'cubic-bezier(0.22,1,0.36,1)',
  };
}

/** Token `motion-delay-layout-deform-content-swap`（→ `ios-layout-deform-content-swap`）。 */
export function resolveMotionLayoutContentSwapMs() {
  return resolveLayoutContentMotionTokens().swapMs;
}
