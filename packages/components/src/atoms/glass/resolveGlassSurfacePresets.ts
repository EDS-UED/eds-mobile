import { mobileTheme } from '../../theme/index.js';
import { resolveColor } from '../../shared/resolveColor.js';
import type { GlassShape, GlassVariant, ResolvedGlassVariant } from './types.js';
import type { ThemeMode } from '../../theme/index.js';

type VariantPresetValue = number | string | { ref: string };

function applyAlpha(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '').slice(0, 6);
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function resolvePresetNumber(
  value: VariantPresetValue | undefined,
  effect: Record<string, number | string>,
): number {
  if (value == null) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number.parseFloat(value);
  if (typeof value === 'object' && 'ref' in value) {
    const key = value.ref.replace(/^effect\./, '');
    return Number(effect[key] ?? 0);
  }
  return 0;
}

export function resolveGlassVariant(variant: GlassVariant): ResolvedGlassVariant {
  const effect = mobileTheme.glass.effect;
  const preset = mobileTheme.glass.surface.variants[variant] ?? {};

  return {
    surfaceOpacity: resolvePresetNumber(preset.surfaceOpacity as VariantPresetValue, effect),
    tintOpacity: resolvePresetNumber(preset.tintOpacity as VariantPresetValue, effect),
    borderOpacity: resolvePresetNumber(preset.borderOpacity as VariantPresetValue, effect),
    highlightOpacity: resolvePresetNumber(preset.highlightOpacity as VariantPresetValue, effect),
    innerHighlightOpacity: resolvePresetNumber(
      preset.innerHighlightOpacity as VariantPresetValue,
      effect,
    ),
    refraction: resolvePresetNumber(preset.refraction as VariantPresetValue, effect),
    blur: Number(effect.blur ?? 50),
    saturation: Number(effect.saturation ?? 3.6),
  };
}

const SHAPE_RADIUS_KEY: Record<GlassShape, string> = {
  capsule: 'radius-full',
  small: 'radius-sm',
  medium: 'radius-md',
  large: 'radius-lg',
  circle: 'radius-full',
};

export function resolveGlassBorderRadius(shape: GlassShape): number | '50%' {
  if (shape === 'circle') return '50%';
  return mobileTheme.spacing[SHAPE_RADIUS_KEY[shape]] as number;
}

export function resolveGlassFaceColor(mode: ThemeMode): string {
  const colors = mobileTheme.colors[mode];
  return resolveColor(colors, 'face');
}

export function resolveGlassHighlightColor(mode: ThemeMode): string {
  const colors = mobileTheme.colors[mode];
  return resolveColor(colors, 'material-face-primary');
}

export function mixGlassSurfaceColor(faceHex: string, opacity: number): string {
  return applyAlpha(faceHex, opacity);
}

export function mixGlassBorderColor(faceHex: string, opacity: number): string {
  return applyAlpha(faceHex, opacity);
}

export function glassBackdropFilter(blur: number, saturation: number): string {
  return `saturate(${Math.round(saturation * 100)}%) blur(${blur}px)`;
}
