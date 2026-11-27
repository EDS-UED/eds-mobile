import { mobileTheme } from '../../theme/index.js';

function readMotionTiming(iosKey: string) {
  const timing = mobileTheme.motion.timings[iosKey];
  if (!timing?.duration) {
    throw new Error(`offsetMotion: missing mobileTheme.motion.timings['${iosKey}']`);
  }
  return timing;
}

/** `EdsSemanticAnima('offset')` · transform / opacity timing。距离由调用方传入。 */
export function resolveOffsetMotionTokens() {
  const transformTiming = readMotionTiming('ios-offset-transform');
  const opacityTiming = readMotionTiming('ios-offset-opacity');

  return {
    transformDurationMs: transformTiming.duration as number,
    transformEasing: transformTiming.easing ?? 'cubic-bezier(0.42,0,0.58,1)',
    opacityDurationMs: opacityTiming.duration as number,
    opacityEasing: opacityTiming.easing ?? 'cubic-bezier(0.42,0,0.58,1)',
    opacityVisible: mobileTheme.motion.opacity['opacity-visible'] ?? 1,
    opacityHidden: mobileTheme.motion.opacity['opacity-hidden'] ?? 0,
  };
}