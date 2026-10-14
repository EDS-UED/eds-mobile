import { Platform, type TextStyle } from 'react-native';
import { mobileTheme } from '../theme/index.js';

type FontRole = 'sans' | 'mono';

const DEFAULT_WEIGHT = '400';

/**
 * Web-only: keep the token fallback stack so CJK / emoji resolve the same way
 * they do on iOS (EDS Text, then PingFang SC / SourceHanSansSC).
 * Native RN takes a single PostScript name; the OS handles missing glyphs.
 */
function withSansFallback(faceName: string): string {
  const stack = String(mobileTheme.typography.base['eds-family-sans'] ?? '');
  if (!stack) return faceName;
  const replaced = stack.replace(/"?EDS Text"?/, `'${faceName}'`);
  return replaced === stack ? `'${faceName}', ${stack}` : replaced;
}

/**
 * Resolve the bundled font face for a weight.
 *
 * React Native does not synthesize weights for bundled fonts, so every weight is
 * a distinct family. Web declares the same family names, which is what makes the
 * browser preview and the device render the identical face.
 */
export function edsFontFamily(
  weight: TextStyle['fontWeight'] = DEFAULT_WEIGHT,
  role: FontRole = 'sans',
): string {
  const { weights } = mobileTheme.fonts[role];
  const face = weights[String(weight)] ?? weights[DEFAULT_WEIGHT];
  if (Platform.OS === 'web' && role === 'sans') {
    return withSansFallback(face);
  }
  return face;
}

/** Font face + weight for a text style, kept together so they can never drift apart. */
export function edsFontStyle(
  weight: TextStyle['fontWeight'] = DEFAULT_WEIGHT,
  role: FontRole = 'sans',
): Pick<TextStyle, 'fontFamily' | 'fontWeight'> {
  return {
    fontFamily: edsFontFamily(weight, role),
    fontWeight: weight,
  };
}
