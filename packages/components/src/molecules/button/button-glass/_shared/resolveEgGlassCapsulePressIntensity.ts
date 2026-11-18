import type { EgGlassCapsuleIconCount, EgGlassCapsuleKind } from '../EgGlassCapsule.types.js';
import type { MotionPressIntensity } from '../../../../shared/themeScalars.js';

/** RN 点按缩放 — 文本 md · 单 icon lg · 双 icon md（与 `EgGlassCapsuleRn` / `GlassInteraction` 一致）。 */
export function resolveEgGlassCapsulePressIntensity(
  kind: EgGlassCapsuleKind,
  iconCount: EgGlassCapsuleIconCount,
): MotionPressIntensity {
  if (kind === 'text') {
    return 'md';
  }
  return iconCount === 2 ? 'md' : 'lg';
}
