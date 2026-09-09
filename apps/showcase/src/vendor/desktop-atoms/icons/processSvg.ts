export type IconKind = 'stroke' | 'fill' | 'mixed';

export type IconFillTone = 'primary' | 'brand';

export type IconColorMode = 'token' | 'fixed';

export type ProcessedIcon = {
  markup: string;
  colorMode: IconColorMode;
  kind: IconKind;
  fillTone: IconFillTone;
};

const BASE_INK = '#020304';
const BRAND_GREEN = '#1FC35A';

const IGNORED_FILLS = new Set(['#FFF', '#FFFFFF', 'NONE']);

const SHAPE_TAG = '(path|line|circle|rect|polyline|polygon)';

function normalizeHex(hex: string): string {
  const h = hex.trim().toUpperCase();
  if (h.length === 4 && h.startsWith('#')) {
    return `#${h[1]}${h[1]}${h[2]}${h[2]}${h[3]}${h[3]}`;
  }
  return h;
}

/** 收集 path 等上的 fill/stroke 色值（忽略 clip 白底、fill=none）。 */
function collectPaintColors(raw: string): Set<string> {
  const colors = new Set<string>();
  const attrRe = /\b(?:fill|stroke)=["']([^"']+)["']/gi;
  let match: RegExpExecArray | null;
  while ((match = attrRe.exec(raw))) {
    const value = match[1].trim();
    if (!value || value.toLowerCase() === 'none') continue;
    if (value.startsWith('#')) {
      const hex = normalizeHex(value);
      if (!IGNORED_FILLS.has(hex)) colors.add(hex);
    }
  }
  const styleRe = /(?:fill|stroke):\s*(#[0-9A-Fa-f]{3,8})/gi;
  while ((match = styleRe.exec(raw))) {
    colors.add(normalizeHex(match[1]));
  }
  return colors;
}

function normalizeSvgShell(iconName: string, raw: string): string {
  let svg = raw.replace(/<\?xml[^?]*\?\>\s*/i, '');

  const viewBoxMatch = svg.match(/viewBox="([^"]+)"/i);
  const viewBox = viewBoxMatch?.[1] ?? '0 0 32 32';

  svg = svg.replace(/<svg[\s\S]*?>/i, `<svg viewBox="${viewBox}" fill="none" xmlns="http://www.w3.org/2000/svg">`);

  svg = svg.replace(/\sid="([^"]+)"/g, ` id="${iconName}-$1"`);
  svg = svg.replace(/url\(#([^)]+)\)/g, `url(#${iconName}-$1)`);

  return svg;
}

function isStructuralFill(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return normalized === 'none' || normalized === 'white' || normalized === '#fff' || normalized === '#ffffff';
}

function shapeHasStroke(tag: string, attrs: string): boolean {
  if (tag === 'line' || tag === 'polyline') return true;
  return /stroke-width=/i.test(attrs);
}

function shapeHasTokenFill(attrs: string): boolean {
  const fillMatch = attrs.match(/\bfill="([^"]+)"/i);
  if (fillMatch && !isStructuralFill(fillMatch[1])) return true;
  if (/fill-rule=/i.test(attrs) && !/stroke-width=/i.test(attrs)) return true;
  return false;
}

function injectClass(attrs: string, className: string): string {
  const classMatch = attrs.match(/\bclass="([^"]*)"/i);
  if (classMatch) {
    const merged = `${classMatch[1]} ${className}`.trim();
    return attrs.replace(classMatch[0], `class="${merged}"`);
  }
  return `${attrs} class="${className}"`;
}

/** 移除 token 色值与内联描边宽度，描边改由 CSS calc 补偿（见 Icon.module.css）。 */
function stripTokenColors(attrs: string): string {
  return attrs
    .replace(/\sstyle="[^"]*"/gi, '')
    .replace(/\s(stroke|fill)="#[^"]*"/gi, '')
    .replace(/\sstroke-width="[^"]*"/gi, '')
    .replace(/\svector-effect="[^"]*"/gi, '');
}

function annotateTokenShapes(svg: string): string {
  const shapeRe = new RegExp(`<${SHAPE_TAG}\\b([^>]*?)(\\/?)>`, 'gi');

  return svg.replace(shapeRe, (match, tag: string, attrs: string, selfClose: string) => {
    const stroke = shapeHasStroke(tag, attrs);
    const fill = shapeHasTokenFill(attrs);
    let clean = stripTokenColors(attrs);
    const classes: string[] = [];
    if (stroke) classes.push('eds-i-s');
    if (fill) classes.push('eds-i-f');
    if (classes.length > 0) {
      clean = injectClass(clean, classes.join(' '));
    }
    return `<${tag}${clean}${selfClose}>`;
  });
}

function stripRedundantStylesOnly(svg: string): string {
  return svg.replace(/\sstyle="[^"]*"/gi, '');
}

/** 渐变、url() 填充、多色或非 token 调色板 — 原样保留 SVG，不参与 token 换色。 */
function usesFixedPalette(raw: string, colors: Set<string>): boolean {
  if (/<(?:linear|radial)Gradient\b/i.test(raw)) return true;
  if (/\b(?:fill|stroke)=["']url\(#/i.test(raw)) return true;
  if (colors.size > 1) return true;

  if (colors.size === 1) {
    const [only] = [...colors];
    if (only !== BASE_INK && only !== BRAND_GREEN) return true;
  }

  return false;
}

function processFixedSvg(iconName: string, raw: string): ProcessedIcon {
  let svg = normalizeSvgShell(iconName, raw);
  svg = stripRedundantStylesOnly(svg);
  return {
    markup: svg.trim(),
    colorMode: 'fixed',
    kind: 'fill',
    fillTone: 'primary',
  };
}

function resolveTokenRole(
  colors: Set<string>,
  hasStroke: boolean,
  hasFill: boolean,
): { colorMode: IconColorMode; kind: IconKind; fillTone: IconFillTone } {
  if (colors.size === 0) {
    if (!hasStroke && !hasFill) {
      return { colorMode: 'token', kind: 'stroke', fillTone: 'primary' };
    }
    return {
      colorMode: 'token',
      kind: hasStroke && hasFill ? 'mixed' : hasStroke ? 'stroke' : 'fill',
      fillTone: 'primary',
    };
  }

  if (colors.size === 1) {
    const [only] = [...colors];
    if (only === BASE_INK) {
      if (hasStroke && hasFill) {
        return { colorMode: 'token', kind: 'mixed', fillTone: 'primary' };
      }
      return {
        colorMode: 'token',
        kind: hasStroke ? 'stroke' : 'fill',
        fillTone: 'primary',
      };
    }
    if (only === BRAND_GREEN) {
      return { colorMode: 'token', kind: 'fill', fillTone: 'brand' };
    }
  }

  return { colorMode: 'fixed', kind: 'fill', fillTone: 'primary' };
}

function detectShapePaint(raw: string): { hasStroke: boolean; hasFill: boolean } {
  const shapeRe = new RegExp(`<${SHAPE_TAG}\\b([^>]*?)(\\/?)>`, 'gi');
  let hasStroke = false;
  let hasFill = false;
  let match: RegExpExecArray | null;

  while ((match = shapeRe.exec(raw))) {
    const tag = match[1];
    const attrs = match[2];
    if (shapeHasStroke(tag, attrs)) hasStroke = true;
    if (shapeHasTokenFill(attrs)) hasFill = true;
  }

  return { hasStroke, hasFill };
}

/** 区分 token 单色图标与彩色硬编码图标；token 图标仅替换配色，不改结构。 */
export function processSvg(iconName: string, raw: string): ProcessedIcon {
  if (/^eds-application-\d+$/.test(iconName) || /^eds-business-\d+$/.test(iconName)) {
    return processFixedSvg(iconName, raw);
  }

  const colors = collectPaintColors(raw);

  if (usesFixedPalette(raw, colors)) {
    return processFixedSvg(iconName, raw);
  }

  const paint = detectShapePaint(raw);
  const role = resolveTokenRole(colors, paint.hasStroke, paint.hasFill);

  let svg = normalizeSvgShell(iconName, raw);

  if (role.colorMode === 'token') {
    svg = annotateTokenShapes(svg);
  } else {
    svg = stripRedundantStylesOnly(svg);
  }

  return {
    markup: svg.trim(),
    colorMode: role.colorMode,
    kind: role.kind,
    fillTone: role.fillTone,
  };
}
