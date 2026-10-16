#!/usr/bin/env node
/**
 * iOS 26+ 系统 Tab 条只接受位图 → EDS SVG 栅格化为 template PNG（@1x/@2x/@3x）。
 * 描边与 EgIcon Tab 尺寸一致：`stroke-lg`（2px @24pt）→ @3x 位图约 6px 线宽。
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import { processSvg } from '../src/atoms/_shared/icon/processSvg.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const iconsDir = join(root, 'src/atoms/_assets/icons');
const outDir = join(root, 'src/organisms/tab-bar/_shared/native-tab-icons');

/** 与 token `symbol-lg` / TabBar `ICON_PT` 一致 */
const ICON_PT = 24;
/** 与 token `stroke-lg`（2px）一致 — 须与 colorizeIconMarkup 同步 */
const STROKE_LG_PX = 2;
const ICON_VIEWBOX_SIZE = 32;
const SCALES = [1, 2, 3];
const TEMPLATE_INK = '#000000';
const SHAPE_TAG = '(path|line|circle|rect|polyline|polygon)';
const ICONS = [
  'eds-index',
  'eds-index-fill',
  'eds-wallet',
  'eds-wallet-fill',
  'eds-circulation',
  'eds-circulation-fill',
  'eds-bill',
  'eds-bill-fill',
];

mkdirSync(outDir, { recursive: true });

function injectPaint(attrs, paint) {
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

/** 同 `colorizeTokenIconMarkup`（displayPx = TabBar 逻辑尺寸） */
function colorizeForTemplate(asset, displayPx) {
  const strokeWidth = STROKE_LG_PX * (ICON_VIEWBOX_SIZE / displayPx);
  const shapeRe = new RegExp(`<${SHAPE_TAG}\\b([^>]*?)(\\/?)>`, 'gi');

  return asset.markup.replace(shapeRe, (match, tag, attrs, selfClose) => {
    const hasStroke = /\beds-i-s\b/.test(attrs);
    const hasFill = /\beds-i-f\b/.test(attrs);
    if (!hasStroke && !hasFill) return match;

    const paint = {};
    if (hasStroke) {
      paint.stroke = TEMPLATE_INK;
      paint['stroke-width'] = String(strokeWidth);
      if (!/\bfill="/i.test(attrs)) paint.fill = 'none';
    }
    if (hasFill) {
      paint.fill = TEMPLATE_INK;
    }

    return `<${tag}${injectPaint(attrs, paint)}${selfClose}>`;
  });
}

function prepareSvgForRaster(name, raw) {
  const stripped = raw.replace(/;?\s*(?:fill|stroke)\s*:\s*color\([^)]*\)/g, '');
  const asset = processSvg(name, stripped);
  if (asset.colorMode === 'token') {
    return colorizeForTemplate(asset, ICON_PT);
  }
  return asset.markup;
}

for (const name of ICONS) {
  const svg = prepareSvgForRaster(name, readFileSync(join(iconsDir, `${name}.svg`), 'utf8'));
  for (const scale of SCALES) {
    const px = ICON_PT * scale;
    const png = new Resvg(svg, { fitTo: { mode: 'width', value: px } }).render().asPng();
    const suffix = scale === 1 ? '' : `@${scale}x`;
    writeFileSync(join(outDir, `${name}${suffix}.png`), png);
  }
}

console.log(`✓ native tab icons: ${ICONS.length} × ${SCALES.length} → ${outDir.replace(`${root}/`, '')}`);
