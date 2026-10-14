import { Platform, type TextStyle } from 'react-native';
import mobileTheme from '@eds/mobile-tokens/theme';

const DEFAULT_WEIGHT = '400';
const typographyBase = mobileTheme.typography.base as Record<string, number | string>;

function withSansFallback(faceName: string): string {
  const stack = String(typographyBase['eds-family-sans'] ?? '');
  if (!stack) {
    return faceName;
  }
  const replaced = stack.replace(/"?EDS Text"?/, `'${faceName}'`);
  return replaced === stack ? `'${faceName}', ${stack}` : replaced;
}

/** Bundled EDS font face for a weight — mirrors @eds/mobile-components edsFontFamily. */
export function edsFontFamily(
  weight: TextStyle['fontWeight'] = DEFAULT_WEIGHT,
  role: 'sans' | 'mono' = 'sans',
): string {
  const { weights } = mobileTheme.fonts[role];
  const face = weights[String(weight)] ?? weights[DEFAULT_WEIGHT];
  if (Platform.OS === 'web' && role === 'sans') {
    return withSansFallback(face);
  }
  return face;
}

export function edsFontStyle(
  weight: TextStyle['fontWeight'] = DEFAULT_WEIGHT,
  role: 'sans' | 'mono' = 'sans',
): Pick<TextStyle, 'fontFamily' | 'fontWeight'> {
  // Bundled faces encode weight in PostScript name — fontWeight on iOS/Android breaks rendering.
  if (Platform.OS === 'web') {
    return {
      fontFamily: edsFontFamily(weight, role),
      fontWeight: weight,
    };
  }

  return {
    fontFamily: edsFontFamily(weight, role),
  };
}
