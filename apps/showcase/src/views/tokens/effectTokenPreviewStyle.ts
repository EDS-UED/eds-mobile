import mobileTheme from '@eds/mobile-tokens/theme';
import type { ViewStyle } from 'react-native';

import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';
import type { TokenEntry } from '@/data/tokens/tokenCatalogTypes';
import { distLookupVar, distResolveValue, distVarValue } from '@/data/tokens/distCssManifest';

export const EFFECT_PREVIEW_DIAMETER = 120;

export type EffectPreviewThemeMode = 'light' | 'dark';

export type EffectPreviewOverlay = {
  topColor: string;
  bottomColor: string;
};

export type EffectPreviewModel = {
  circleStyle: ViewStyle;
  overlay?: EffectPreviewOverlay;
  blurIntensity?: number;
};

import type {
  GlassBoxClassName,
  GlassBoxComposition as GlassBoxResolved,
  GlassBoxLayer,
  GlassBoxShadowLayer as GlassBoxShadow,
} from '@/views/tokens/glassBoxPreviewTypes';
import { resolveGlassBoxPreviewComposition } from '@/views/tokens/glassBoxPreviewTypes';

const GLASS_BOX_CLASS_NAMES = new Set<string>([
  'glass-button-box',
  'glass-flotation-box',
  'glass-tabbar-box',
  'glass-mask-box',
]);

export function isGlassBoxPreviewClass(name: string): name is GlassBoxClassName {
  return GLASS_BOX_CLASS_NAMES.has(name);
}

function isGlassBoxClass(name: string): name is GlassBoxClassName {
  return isGlassBoxPreviewClass(name);
}

function resolveGlassBox(className: GlassBoxClassName, mode: EffectPreviewThemeMode): GlassBoxResolved {
  return resolveGlassBoxPreviewComposition(className, mode);
}

function resolveVarChain(raw: string): string {
  return raw.replace(/var\(--([a-z0-9-]+)\)/g, (_, name) => {
    const resolved = distLookupVar(`--${name}`) ?? distVarValue('scale', name) ?? distVarValue('color', name);
    return resolved ? distResolveValue(String(resolved)) : raw;
  });
}

function parsePx(value: string): number {
  const trimmed = value.trim();
  if (trimmed.endsWith('px')) {
    return Number.parseFloat(trimmed);
  }
  const numeric = Number.parseFloat(trimmed);
  return Number.isFinite(numeric) ? numeric : 0;
}

function shadowLayerToViewStyle(layer: string): ViewStyle | undefined {
  const normalized = resolveVarChain(layer).replace(/\binset\b/gi, '').trim();
  const inset = /\binset\b/i.test(layer);
  if (inset) {
    return undefined;
  }

  const parts = normalized.split(/\s+/);
  if (parts.length < 4) {
    return undefined;
  }

  const offsetX = parsePx(parts[0]);
  const offsetY = parsePx(parts[1]);
  const blurRadius = parsePx(parts[2]);
  const color = parts.slice(4).join(' ') || '#00000040';

  return {
    shadowColor: color,
    shadowOffset: { width: offsetX, height: offsetY },
    shadowOpacity: 1,
    shadowRadius: blurRadius,
    elevation: Math.max(2, Math.round(blurRadius)),
  };
}

function resolveShadowTokenStyle(tokenName: string, fillColor: string): ViewStyle {
  const raw = distVarValue('effect', tokenName);
  const circle: ViewStyle = {
    width: EFFECT_PREVIEW_DIAMETER,
    height: EFFECT_PREVIEW_DIAMETER,
    borderRadius: EFFECT_PREVIEW_DIAMETER / 2,
    backgroundColor: fillColor,
  };

  if (!raw) {
    return circle;
  }

  const layers = raw.split(/,(?![^(]*\))/).map((part) => part.trim());
  for (const layer of layers) {
    const shadow = shadowLayerToViewStyle(layer);
    if (shadow) {
      return { ...circle, ...shadow };
    }
  }

  return circle;
}

function resolveBlurGlassPreview(fillColor: string): EffectPreviewModel {
  const blurMd = mobileTheme.spacing['blur-md'];
  const blurPx = typeof blurMd === 'number' ? blurMd / 2 : 8;
  const intensity = Math.min(100, Math.max(20, Math.round(blurPx * 1.6)));

  return {
    circleStyle: {
      width: EFFECT_PREVIEW_DIAMETER,
      height: EFFECT_PREVIEW_DIAMETER,
      borderRadius: EFFECT_PREVIEW_DIAMETER / 2,
      backgroundColor: fillColor,
      overflow: 'hidden',
    },
    blurIntensity: intensity,
  };
}

function compositionToPreview(className: GlassBoxClassName, mode: EffectPreviewThemeMode): EffectPreviewModel {
  const composition = resolveGlassBox(className, mode);
  const fillLayer = composition.layers.find((layer: GlassBoxLayer) => layer.kind === 'fill');
  const gradientLayer = composition.layers.find(
    (layer: GlassBoxLayer) => layer.kind === 'overlayGradient',
  );

  const circleStyle: ViewStyle = {
    width: EFFECT_PREVIEW_DIAMETER,
    height: EFFECT_PREVIEW_DIAMETER,
    borderRadius: EFFECT_PREVIEW_DIAMETER / 2,
    backgroundColor: fillLayer?.kind === 'fill' ? fillLayer.color : 'transparent',
    overflow: 'hidden',
  };

  if (composition.border) {
    circleStyle.borderWidth = composition.border.width;
    circleStyle.borderColor = composition.border.color;
  }

  const outerShadow = composition.shadows.find((shadow: GlassBoxShadow) => !shadow.inset);
  if (outerShadow) {
    circleStyle.shadowColor = outerShadow.color;
    circleStyle.shadowOffset = { width: outerShadow.offsetX, height: outerShadow.offsetY };
    circleStyle.shadowOpacity = 1;
    circleStyle.shadowRadius = outerShadow.blurRadius;
    circleStyle.elevation = Math.max(2, Math.round(outerShadow.blurRadius));
  }

  const overlay =
    gradientLayer?.kind === 'overlayGradient' && gradientLayer.stops.length >= 2
      ? {
          topColor: gradientLayer.stops[0]?.color ?? 'transparent',
          bottomColor: gradientLayer.stops[gradientLayer.stops.length - 1]?.color ?? 'transparent',
        }
      : undefined;

  const blurIntensity = composition.backdropBlur?.nativeIntensity;

  return { circleStyle, overlay, blurIntensity };
}

export function resolveEffectPreviewModel(
  entry: TokenEntry,
  mode: EffectPreviewThemeMode,
  colors: ShowcaseColorMap,
): EffectPreviewModel {
  const fill = colors['effect-box'] as string;

  if (entry.cssVar.startsWith('.') && isGlassBoxClass(entry.name)) {
    return compositionToPreview(entry.name, mode);
  }

  if (entry.name === 'eds-blur-glass') {
    return resolveBlurGlassPreview(fill);
  }

  if (entry.name.startsWith('eds-shadow-box-')) {
    return { circleStyle: resolveShadowTokenStyle(entry.name, fill) };
  }

  return {
    circleStyle: {
      width: EFFECT_PREVIEW_DIAMETER,
      height: EFFECT_PREVIEW_DIAMETER,
      borderRadius: EFFECT_PREVIEW_DIAMETER / 2,
      backgroundColor: fill,
    },
  };
}
