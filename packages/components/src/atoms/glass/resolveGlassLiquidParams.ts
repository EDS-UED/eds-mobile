import { mobileTheme } from '../../theme/index.js';
import type { ThemeMode } from '../../theme/index.js';
import type { ResolvedGlassVariant } from './types.js';

type LiquidPresetValue = number | { ref: string };

function resolveLiquidNumber(
  value: LiquidPresetValue | undefined,
  effect: Record<string, number | string>,
  fallback: number,
): number {
  if (value == null) {
    return fallback;
  }
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'object' && 'ref' in value) {
    const key = value.ref.replace(/^effect\./, '');
    return Number(effect[key] ?? fallback);
  }
  return fallback;
}

export type ResolvedGlassLiquidParams = {
  intensity: number;
  opacity: number;
  noise: number;
  distortion: number;
  highlight: boolean;
  highlightIntensity: number;
  saturation: number;
};

export function resolveGlassLiquidParams(
  mode: ThemeMode,
  variant: ResolvedGlassVariant,
  overrides?: Partial<ResolvedGlassLiquidParams>,
): ResolvedGlassLiquidParams {
  const effect = mobileTheme.glass.effect;
  const liquidPresets = (
    mobileTheme.glass.surface as { liquid?: Record<string, Record<string, LiquidPresetValue | boolean>> }
  ).liquid;
  const tier = liquidPresets?.[mode] ?? {};

  const intensity = overrides?.intensity ??
    resolveLiquidNumber(tier.intensity as LiquidPresetValue, effect, 30);
  const opacity = overrides?.opacity ??
    resolveLiquidNumber(tier.opacity as LiquidPresetValue, effect, 0.18);
  const noise = overrides?.noise ??
    resolveLiquidNumber(tier.noise as LiquidPresetValue, effect, 0.04);
  const distortion = overrides?.distortion ??
    resolveLiquidNumber(tier.distortion as LiquidPresetValue, effect, variant.refraction || 0.03);
  const highlight =
    overrides?.highlight ?? (typeof tier.highlight === 'boolean' ? tier.highlight : true);
  const highlightIntensity = overrides?.highlightIntensity ??
    resolveLiquidNumber(tier.highlightIntensity as LiquidPresetValue, effect, 0.15);

  return {
    intensity,
    opacity,
    noise,
    distortion,
    highlight,
    highlightIntensity,
    saturation: Number(effect.saturation ?? 3.6),
  };
}
