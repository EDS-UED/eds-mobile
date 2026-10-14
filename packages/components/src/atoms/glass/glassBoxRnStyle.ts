import { Platform, type ViewStyle } from 'react-native';

import { formatRgba, parseHexColor, rnColorFromHex } from './glassBoxColorUtils.js';
import type { GlassBoxShadowLayer } from './resolveGlassBox.js';

/** 单层 shadow → CSS `box-shadow` 片段（与 dist/css/effect、RN `boxShadow` 同语义）。 */
export function glassBoxShadowLayerToCss(layer: GlassBoxShadowLayer): string {
  const insetPrefix = layer.inset ? 'inset ' : '';
  const spread = layer.spread ?? 0;
  const parsed = parseHexColor(layer.color);
  const color = parsed ? formatRgba(parsed) : layer.color;

  return `${insetPrefix}${layer.offsetX}px ${layer.offsetY}px ${layer.blurRadius}px ${spread}px ${color}`;
}

function joinShadowCss(layers: GlassBoxShadowLayer[]): string | undefined {
  if (layers.length === 0) {
    return undefined;
  }
  return layers.map((layer) => glassBoxShadowLayerToCss(layer)).join(', ');
}

/** 外阴影（outset）— shadow host，`overflow: visible`。 */
export function glassBoxOuterShadowCss(layers: GlassBoxShadowLayer[]): string | undefined {
  return joinShadowCss(layers.filter((layer) => !layer.inset));
}

/** 内阴影（inset）— 对齐 Figma 内层 Inner Shadow / `effect-inner-light`，叠在 clip 上。 */
export function glassBoxInsetShadowCss(layers: GlassBoxShadowLayer[]): string | undefined {
  return joinShadowCss(layers.filter((layer) => layer.inset));
}

export function rnOuterShadowStyleFromCss(boxShadow: string | undefined): ViewStyle {
  if (!boxShadow) {
    return Platform.OS === 'android' ? { elevation: 0 } : {};
  }

  return {
    boxShadow,
    ...(Platform.OS === 'android' ? { elevation: 0 } : null),
  };
}

/** 外阴影 host（EgGlass 外层）。 */
export function rnGlassBoxOuterShadowHostStyle(shadows: GlassBoxShadowLayer[]): ViewStyle {
  return rnOuterShadowStyleFromCss(glassBoxOuterShadowCss(shadows));
}

/** 内阴影 clip（EgGlass 内层，对应 Figma 第二 div inset shadow）。 */
export function rnGlassBoxInsetShadowClipStyle(shadows: GlassBoxShadowLayer[]): ViewStyle {
  return rnOuterShadowStyleFromCss(glassBoxInsetShadowCss(shadows));
}

export function rnOuterShadowStyle(shadow: GlassBoxShadowLayer): ViewStyle {
  return rnOuterShadowStyleFromCss(glassBoxShadowLayerToCss(shadow));
}

export { rnColorFromHex };
