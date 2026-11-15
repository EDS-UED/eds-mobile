import { Platform, type TextStyle } from 'react-native';
import { mobileTheme } from '../theme/index.js';

type FontRole = 'sans' | 'mono';

const DEFAULT_WEIGHT = '400';

/**
 * Web：保留 token `eds-family-sans` 栈（EDS Text → PingFang → …）。
 * Native sans：bundled PostScript 名；禁止与 `fontFamily` 同设 `fontWeight`。
 * iOS 混排 UI 须用 {@link EdsSansText}，勿对含中文的 `Text` 单挂 `fontFamily`。
 * Native mono：各平台 bundled 单 face。
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
): Partial<Pick<TextStyle, 'fontFamily' | 'fontWeight'>> {
  const fontFamily = edsFontFamily(weight, role);
  if (Platform.OS === 'web') {
    return {
      fontFamily,
      fontWeight: weight as TextStyle['fontWeight'],
    };
  }

  return { fontFamily };
}
