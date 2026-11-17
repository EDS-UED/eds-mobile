import { mobileTheme } from '../../theme/index.js';

function readMotionTiming(iosKey: string) {
  const timing = mobileTheme.motion.timings[iosKey];
  if (!timing?.duration) {
    throw new Error(`fadeMotion: missing mobileTheme.motion.timings['${iosKey}']`);
  }
  return timing;
}

/** Token `motion-fade` · EdsSemanticAnima('fade')。 */
export function resolveFadeMotionTokens() {
  const opacityTiming = readMotionTiming('ios-fade-opacity');
  const swapTiming = readMotionTiming('ios-fade-swap');

  return {
    swapMs: swapTiming.duration as number,
    opacityVisible: mobileTheme.motion.opacity['opacity-visible'] ?? 1,
    opacityHidden: mobileTheme.motion.opacity['opacity-hidden'] ?? 0,
    opacityDurationMs: opacityTiming.duration as number,
    opacityEasing: opacityTiming.easing ?? 'cubic-bezier(0.42,0,0.58,1)',
  };
}

/** Token `motion-delay-fade-swap`。 */
export function resolveMotionFadeSwapMs() {
  return resolveFadeMotionTokens().swapMs;
}