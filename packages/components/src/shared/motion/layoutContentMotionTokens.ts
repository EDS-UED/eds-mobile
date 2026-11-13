import { mobileTheme } from '../../theme/index.js';

/** 与 spec `motion-delay-layout-deform-content-swap` 一致。 */
export const MOTION_LAYOUT_CONTENT_SWAP_MS = 120;

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
  const offsetY = mobileTheme.spacing['spacing-2-5'] as number;

  return {
    swapMs: MOTION_LAYOUT_CONTENT_SWAP_MS,
    offsetY,
    opacityVisible: mobileTheme.motion.opacity['opacity-visible'] ?? 1,
    opacityHidden: mobileTheme.motion.opacity['opacity-hidden'] ?? 0,
    opacityDurationMs: opacityTiming.duration as number,
    transformDurationMs: transformTiming.duration as number,
    opacityEasing: opacityTiming.easing ?? 'cubic-bezier(0.42,0,0.58,1)',
    transformEasing: transformTiming.easing ?? 'cubic-bezier(0.22,1,0.36,1)',
  };
}
