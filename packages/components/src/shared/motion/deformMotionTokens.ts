import { mobileTheme } from '../../theme/index.js';

function readMotionTiming(iosKey: string) {
  const timing = mobileTheme.motion.timings[iosKey];
  if (!timing?.duration) {
    throw new Error(`deformMotion: missing mobileTheme.motion.timings['${iosKey}']`);
  }
  return timing;
}

/** `EdsSemanticAnima('deform')` · 宽高 / 圆角 timing，以及内容 opacity timing。起止形态由调用方传入。 */
export function resolveDeformMotionTokens() {
  const geometryTiming = readMotionTiming('ios-deform-transform');
  const opacityTiming = readMotionTiming('ios-deform-opacity');

  return {
    geometryDurationMs: geometryTiming.duration as number,
    geometryEasing: geometryTiming.easing ?? 'cubic-bezier(0.42,0,0.58,1)',
    opacityDurationMs: opacityTiming.duration as number,
    opacityEasing: opacityTiming.easing ?? 'cubic-bezier(0.42,0,0.58,1)',
    opacityVisible: mobileTheme.motion.opacity['opacity-visible'] ?? 1,
    opacityHidden: mobileTheme.motion.opacity['opacity-hidden'] ?? 0,
  };
}