import type { IconFillTone } from '../../../atoms/_shared/icon/processSvg.js';
import { resolveColor } from '../../../shared/resolveColor.js';
import type { getThemeColors } from '../../../theme/index.js';

/** Tab 选中强调 — 默认 `brand`；Cregis 场景 `decor`。 */
export type EgTabBarSelectionAccent = 'brand' | 'decor';

export function egTabBarSelectionLabelToken(accent: EgTabBarSelectionAccent): string {
  return accent === 'decor' ? 'material-decor' : 'text-brand';
}

export function egTabBarSelectionStrokeToken(accent: EgTabBarSelectionAccent): string {
  return accent === 'decor' ? 'material-decor' : 'stroke-color-brand';
}

export function egTabBarSelectionFillTone(accent: EgTabBarSelectionAccent): IconFillTone {
  return accent === 'decor' ? 'decor' : 'brand';
}

export function egTabBarNativeActiveTintColor(
  colors: ReturnType<typeof getThemeColors>,
  accent: EgTabBarSelectionAccent,
): string {
  return resolveColor(colors, egTabBarSelectionLabelToken(accent));
}
