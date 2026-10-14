import type { TextStyle } from 'react-native';
import mobileTheme from '@eds/mobile-tokens/theme';

import { edsFontStyle } from '@/lib/edsFontFamily';

type TokenPool = Record<string, number | string>;

/** Resolve CSS-style `var(--token)` chains against mobileTheme pools (like semantic.css). */
export function resolveThemeRef(value: string | number, pool: TokenPool): number {
  if (typeof value === 'number') {
    return value;
  }

  const match = /^var\(--([a-z0-9-]+)\)$/.exec(value);
  if (!match) {
    return Number.parseFloat(value) || 0;
  }

  const next = pool[match[1]];
  if (next === undefined) {
    return 0;
  }

  if (typeof next === 'number') {
    return next;
  }

  return resolveThemeRef(next, pool);
}

export function resolveThemeRefString(value: string | number, pool: TokenPool): string {
  if (typeof value === 'number') {
    return String(value);
  }

  const match = /^var\(--([a-z0-9-]+)\)$/.exec(value);
  if (!match) {
    return value;
  }

  const next = pool[match[1]];
  if (next === undefined) {
    return value;
  }

  if (typeof next === 'string' && next.startsWith('var(--')) {
    return resolveThemeRefString(next, pool);
  }

  return String(next);
}

export type TypographyRole =
  | 'display'
  | 'body-large'
  | 'body-large-strong'
  | 'body-medium'
  | 'body-medium-strong'
  | 'body-small'
  | 'body-small-strong'
  | 'detail'
  | 'detail-strong'
  | 'footnote'
  | 'footnote-strong'
  | 'bar'
  | 'headline'
  | 'title';

const typographyBase = mobileTheme.typography.base as TokenPool;
const typographySemantic = mobileTheme.typography.semantic;

/** Typography semantic role → resolved RN TextStyle fragments (eds-* → size-* / weight-*). */
export function edsTypographyRole(role: TypographyRole) {
  const prefix = `eds-${role}`;
  return {
    fontSize: resolveThemeRef(typographySemantic[`${prefix}-size`], typographyBase),
    lineHeight: resolveThemeRef(typographySemantic[`${prefix}-line-height`], typographyBase),
    fontWeight: resolveThemeRefString(
      typographySemantic[`${prefix}-weight`],
      typographyBase,
    ) as '400' | '500' | '600' | '700',
  };
}

/** Typography role + bundled font face — avoid fontWeight / fontFamily mismatch on iOS. */
export function edsTokenFont(
  role: TypographyRole,
  weight: TextStyle['fontWeight'],
  fontRole: 'sans' | 'mono' = 'sans',
) {
  const typography = edsTypographyRole(role);
  return {
    fontSize: typography.fontSize,
    lineHeight: typography.lineHeight,
    ...edsFontStyle(weight, fontRole),
  };
}

/**
 * Card / list row primary label — `--size-body-medium` (17) + `--weight-semibold` (600).
 * Native：只用 bundled `EDSText-SemiBold` 单 face；混排中文会系统 fallback，视觉字重与纯英文不一致。
 */
export function edsListRowTitleStyle(): Pick<TextStyle, 'fontSize' | 'lineHeight' | 'fontFamily' | 'fontWeight'> {
  const base = mobileTheme.typography.base;
  return {
    fontSize: base['size-body-medium'] as number,
    lineHeight: base['line-height-body-medium'] as number,
    ...edsFontStyle('600', 'sans'),
  };
}

/** Scale semantic spacing token, e.g. spacing-5. */
export function edsSpacing(token: keyof typeof mobileTheme.spacing | string): number {
  return mobileTheme.spacing[token] as number;
}

/** Scale base primitive, e.g. scale-8 → 32px (n × scale-base). */
export function edsScale(token: keyof typeof mobileTheme.scale | string): number {
  const scaleBase = mobileTheme.spacing['spacing-1'] as number;
  return (mobileTheme.scale[token] as number) * scaleBase;
}

/** Scale semantic radius token, e.g. radius-lg. */
export function edsRadius(token: `radius-${string}`): number {
  return mobileTheme.spacing[token] as number;
}

/** Figma --corner-smoothing on iOS — radius token + continuous squircle curve. Skip for radius-full. */
export function edsSmoothRadius(token: `radius-${string}`) {
  return {
    borderRadius: edsRadius(token),
    borderCurve: 'continuous' as const,
  };
}
