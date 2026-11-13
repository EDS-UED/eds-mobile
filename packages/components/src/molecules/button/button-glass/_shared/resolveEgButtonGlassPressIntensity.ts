import type { EgButtonGlassIconCount, EgButtonGlassKind } from '../EgButtonGlass.types.js';
import type { MotionPressIntensity } from '../../../../shared/themeScalars.js';

/** RN 点按缩放 — 文本 md · 单 icon lg · 双 icon md（与 `EgButtonGlassRn` / `GlassInteraction` 一致）。 */
export function resolveEgButtonGlassPressIntensity(
  kind: EgButtonGlassKind,
  iconCount: EgButtonGlassIconCount,
): MotionPressIntensity {
  if (kind === 'text') {
    return 'md';
  }
  return iconCount === 2 ? 'md' : 'lg';
}
