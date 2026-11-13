import { Platform, type ColorValue } from 'react-native';

/** Figma / CSS `color(display-p3 r g b)` components in 0–1 range. */
export type EdsDisplayP3Components = readonly [number, number, number];

export type EdsDisplayP3ColorObject = {
  space: 'display-p3';
  r: number;
  g: number;
  b: number;
  a: number;
};

function appendAlphaHex(srgbHex: string, alpha: number): string {
  const normalized = srgbHex.replace('#', '').slice(0, 6);
  if (alpha >= 1) {
    return `#${normalized}`;
  }
  const alphaByte = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0');
  return `#${normalized}${alphaByte}`;
}

/**
 * Resolve a brand / accent fill for StyleSheet.
 * iOS: RN Fabric `{ space: 'display-p3', r, g, b, a }` → UIColor P3.
 * Android & others: sRGB hex from spec (with alpha suffix when needed).
 */
export function edsColorFromDisplayP3(
  displayP3: EdsDisplayP3Components,
  srgbHexFallback: string,
  alpha = 1,
): ColorValue {
  const [r, g, b] = displayP3;
  if (Platform.OS === 'ios') {
    const p3: EdsDisplayP3ColorObject = { space: 'display-p3', r, g, b, a: alpha };
    return p3 as unknown as ColorValue;
  }
  return appendAlphaHex(srgbHexFallback, alpha);
}

/** Brand base (`--eds-brand`) · pass Figma `displayP3` + sRGB hex fallback. */
export function edsBrandColorValue(
  displayP3: EdsDisplayP3Components,
  srgbHex: string,
  alpha = 1,
): ColorValue {
  return edsColorFromDisplayP3(displayP3, srgbHex, alpha);
}
