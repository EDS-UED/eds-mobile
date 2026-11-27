import { parseHexColor } from '../../../atoms/glass/glassBoxColorUtils.js';
import type {
  GlassBoxComposition,
  GlassBoxShadowLayer,
} from '../../../atoms/glass/resolveGlassBox.js';

export type EgPopoversShellPaint = 'glass-masked' | 'token-only';

/** MaskedView 裁切：白实色路径 · 背景透明（勿铺矩形底色）。 */
export function buildEgPopoversMaskMarkup(
  viewBox: string,
  shellWidth: number,
  shellHeight: number,
  path: string,
): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${shellWidth}" height="${shellHeight}" viewBox="${viewBox}"><path fill="#ffffff" fill-rule="evenodd" d="${path}"/></svg>`;
}

function outerShadowLayers(shadows: GlassBoxShadowLayer[]) {
  return shadows.filter((layer) => !layer.inset);
}

function shadowFlood(layer: GlassBoxShadowLayer) {
  const parsed = parseHexColor(layer.color);
  if (!parsed) {
    return { color: layer.color, opacity: 1 };
  }
  const { r, g, b, a } = parsed;
  return { color: `rgb(${r},${g},${b})`, opacity: a };
}

/**
 * Menu box 外阴影 — 沿 path 偏移叠色（避免宿主矩形 box-shadow；RN 上 feDropShadow 不可靠）。
 */
export function buildEgPopoversShapeShadowMarkup(
  viewBox: string,
  shellWidth: number,
  shellHeight: number,
  path: string,
  shadows: GlassBoxShadowLayer[],
): string | null {
  const outer = outerShadowLayers(shadows);
  if (outer.length === 0) {
    return null;
  }
  const layers = outer
    .map((layer) => {
      const flood = shadowFlood(layer);
      const alpha = Math.min(flood.opacity * 0.85, 1);
      return `<path fill="${flood.color}" fill-opacity="${alpha}" fill-rule="evenodd" d="${path}" transform="translate(${layer.offsetX} ${layer.offsetY})"/>`;
    })
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${shellWidth}" height="${shellHeight}" viewBox="${viewBox}" overflow="visible">${layers}</svg>`;
}

/** 一体轮廓 · token 叠色 + 描边；`glass-masked` 时不叠 token 填色（毛玻璃已承载 menu box）。 */
export function buildEgPopoversShellMarkup(
  viewBox: string,
  shellWidth: number,
  shellHeight: number,
  path: string,
  composition: GlassBoxComposition,
  paint: EgPopoversShellPaint,
  strokeColor?: string,
  strokeWidth?: number,
): string {
  const fillLayer = composition.layers.find((layer) => layer.kind === 'fill');
  const fill = fillLayer?.kind === 'fill' ? fillLayer.color : 'transparent';
  const gradientLayer = composition.layers.find((layer) => layer.kind === 'overlayGradient');
  let defs = '';
  let overlayPath = '';
  const paintTokenFill = paint === 'token-only';
  if (paintTokenFill && gradientLayer?.kind === 'overlayGradient' && gradientLayer.stops.length >= 2) {
    const stops = gradientLayer.stops
      .map((stop) => `<stop offset="${stop.position}" stop-color="${stop.color}"/>`)
      .join('');
    defs = `<defs><linearGradient id="eg-popover-menu-overlay" x1="0.5" y1="1" x2="0.5" y2="0">${stops}</linearGradient></defs>`;
    overlayPath = `<path fill="url(#eg-popover-menu-overlay)" fill-rule="evenodd" d="${path}"/>`;
  }
  const basePath = paintTokenFill
    ? `<path fill="${fill}" fill-rule="evenodd" d="${path}"/>`
    : '';
  const strokePath =
    strokeColor != null && (strokeWidth ?? 0) > 0
      ? `<path fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" d="${path}"/>`
      : '';
  const shapeBlock = paintTokenFill ? `${basePath}${overlayPath}` : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${shellWidth}" height="${shellHeight}" viewBox="${viewBox}" overflow="visible">${defs}${shapeBlock}${strokePath}</svg>`;
}