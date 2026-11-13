import type { ViewStyle } from 'react-native';

import { mobileTheme } from '../../theme/index.js';
import {
  mixGlassBorderColor,
  resolveGlassFaceColor,
  resolveGlassVariant,
} from './resolveGlassSurfacePresets.js';
import type { ThemeMode } from '../../theme/index.js';

/** iOS 27 Community · Liquid Glass Text/Symbol — RN 近似（仅现有 token）。 */
export function resolveIos27ToolbarGlassChrome(mode: ThemeMode): ViewStyle {
  const spacing = mobileTheme.spacing;
  const effect = mobileTheme.glass.effect as Record<string, number | string>;
  const preset = resolveGlassVariant('clear');
  const face = resolveGlassFaceColor(mode);
  const shadowOpacity = Number(effect['shadow-opacity'] ?? 0.12);
  const depth = spacing['depth-lg'] as number | undefined;
  const shadowOffsetY = spacing['spacing-2'] as number;

  return {
    borderColor: mixGlassBorderColor(face, preset.borderOpacity),
    borderWidth: spacing['stroke-md'] as number,
    shadowColor: '#000000',
    shadowOpacity: Math.min(shadowOpacity, 0.08),
    shadowRadius: shadowOffsetY + (spacing['spacing-1'] as number),
    shadowOffset: { width: 0, height: depth ?? shadowOffsetY },
    elevation: 2,
  };
}
