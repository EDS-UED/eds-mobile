import { mobileTheme } from '../../../theme/index.js';
import type { ProcessedIcon, IconFillTone } from './processSvg.js';
import { ICON_VIEWBOX_SIZE, sizeIconMarkup } from './sizeIconMarkup.js';

const SHAPE_TAG = '(path|line|circle|rect|polyline|polygon)';

function injectPaint(attrs: string, paint: Record<string, string>): string {
  let next = attrs;
  for (const [key, value] of Object.entries(paint)) {
    const re = new RegExp(`\\s${key}="[^"]*"`, 'i');
    if (re.test(next)) {
      next = next.replace(re, ` ${key}="${value}"`);
    } else {
      next = `${next} ${key}="${value}"`;
    }
  }
  return next;
}

/** Token icons — inline stroke/fill (RN has no Icon.module.css). */
export function colorizeTokenIconMarkup(
  asset: ProcessedIcon,
  options: {
    strokeColor: string;
    fillColor: string;
    displayPx: number;
  },
): string {
  const strokeWidth = (mobileTheme.spacing['stroke-lg'] as number) * (ICON_VIEWBOX_SIZE / options.displayPx);
  const shapeRe = new RegExp(`<${SHAPE_TAG}\\b([^>]*?)(\\/?)>`, 'gi');

  const svg = asset.markup.replace(shapeRe, (match, tag: string, attrs: string, selfClose: string) => {
    const hasStroke = /\beds-i-s\b/.test(attrs);
    const hasFill = /\beds-i-f\b/.test(attrs);
    if (!hasStroke && !hasFill) return match;

    const paint: Record<string, string> = {};
    if (hasStroke) {
      paint.stroke = options.strokeColor;
      paint['stroke-width'] = String(strokeWidth);
      if (!/\bfill="/i.test(attrs)) paint.fill = 'none';
    }
    if (hasFill) {
      paint.fill = options.fillColor;
    }

    return `<${tag}${injectPaint(attrs, paint)}${selfClose}>`;
  });

  return sizeIconMarkup(svg, options.displayPx);
}

export function resolveIconFillTone(
  asset: ProcessedIcon,
  override?: IconFillTone,
): IconFillTone {
  return override ?? asset.fillTone;
}
