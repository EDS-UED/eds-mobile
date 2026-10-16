import { mobileTheme } from '../theme/index.js';

/** Press scale intensity — `xs` | `sm` | `md` | `lg`（默认 `sm` ≈ 原 md 档 1.04）。 */
export type MotionPressIntensity = 'xs' | 'sm' | 'md' | 'lg';

/** Disabled control opacity — motion-opacity-disabled. */
export function disabledOpacity(): number {
  return mobileTheme.motion.opacity['opacity-disabled'] as number;
}

function readScale(key: string, fallbackKey: string): number {
  const scale = mobileTheme.motion.scale as Record<string, number>;
  return (scale[key] ?? scale[fallbackKey]) as number;
}

/** Press scale — `motion-scale-press-*`；默认 `sm`。 */
export function motionPressScale(intensity: MotionPressIntensity = 'sm'): number {
  const keyByIntensity: Record<MotionPressIntensity, string> = {
    xs: 'scale-press-xs',
    sm: 'scale-press-sm',
    md: 'scale-press-md',
    lg: 'scale-press-lg',
  };
  return readScale(keyByIntensity[intensity], 'scale-press');
}

/** Glass press scale — `motion-glass-scale-press-*`；默认 `sm`。 */
export function motionGlassPressScale(intensity: MotionPressIntensity = 'sm'): number {
  const keyByIntensity: Record<MotionPressIntensity, string> = {
    xs: 'glass-scale-press-xs',
    sm: 'glass-scale-press-sm',
    md: 'glass-scale-press-md',
    lg: 'glass-scale-press-lg',
  };
  return readScale(keyByIntensity[intensity], 'glass-scale-press');
}

/** Icon container label font size ratio (55% of icon size). */
export function iconContainerLabelScale(): number {
  return 0.55;
}
