import { mobileTheme } from '../theme/index.js';

/** Press scale intensity — `xs` | `sm` | `md` | `lg`（默认 `sm` ≈ 原 md 档 1.04）。 */
export type MotionPressIntensity = 'xs' | 'sm' | 'md' | 'lg';

/** 点按缩放方向 — `up` 放大；`down` 缩小（`motion-scale-press-down-*`）。 */
export type MotionPressScaleDirection = 'up' | 'down';

/** Disabled control opacity — 待 disabled 语义 token 前固定 0.5。 */
export function disabledOpacity(): number {
  return 0.5;
}

function readScale(key: string, fallbackKey: string, hardFallback: number): number {
  const scale = mobileTheme.motion.scale as Record<string, number>;
  const value = (scale[key] ?? scale[fallbackKey]) as number | undefined;
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return value;
  }
  return hardFallback;
}

/** Press scale — `motion-scale-press-*` / `motion-scale-press-down-*`。 */
export function motionPressScale(
  intensity: MotionPressIntensity = 'sm',
  direction: MotionPressScaleDirection = 'up',
): number {
  if (direction === 'down') {
    const keyByIntensity: Record<MotionPressIntensity, string> = {
      xs: 'scale-press-down-xs',
      sm: 'scale-press-down-sm',
      md: 'scale-press-down-md',
      lg: 'scale-press-down-lg',
    };
    return readScale(keyByIntensity[intensity], 'scale-press-down-sm', 0.96);
  }
  const keyByIntensity: Record<MotionPressIntensity, string> = {
    xs: 'scale-press-xs',
    sm: 'scale-press-sm',
    md: 'scale-press-md',
    lg: 'scale-press-lg',
  };
  return readScale(keyByIntensity[intensity], 'scale-press', 1.04);
}

/** Glass 按压 scale — 与 press 共用 `motion-scale-press-*`（待 glass Semantic）。 */
export function motionGlassPressScale(
  intensity: MotionPressIntensity = 'sm',
  direction: MotionPressScaleDirection = 'up',
): number {
  return motionPressScale(intensity, direction);
}

/** Icon container label font size ratio (55% of icon size). */
export function iconContainerLabelScale(): number {
  return 0.55;
}
