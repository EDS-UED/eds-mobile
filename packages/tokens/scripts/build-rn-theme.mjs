import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { resolveSemanticColorToHex } from './color-reference.mjs';
import { buildGlassBoxCompositions } from './resolve-effect-glass-box.mjs';

function loadJson(specDir, relativePath) {
  return JSON.parse(readFileSync(join(specDir, relativePath), 'utf-8'));
}

function buildScaleResolvedPool(baseSpec) {
  const unit = baseSpec.scaleBase ?? baseSpec.controlBase ?? 4;
  const pool = { 'scale-base': unit };

  for (const [name, entry] of Object.entries(baseSpec.scale ?? {})) {
    if (typeof entry === 'number') {
      pool[name] = entry * unit;
      continue;
    }

    if (typeof entry === 'string' && entry.endsWith('px')) {
      pool[name] = Number.parseFloat(entry);
    }
  }

  return pool;
}

function formatResolvedNumber(value) {
  return Number.isInteger(value) ? value : Number(Number(value.toFixed(4).replace(/\.?0+$/, '')));
}

function evaluateScaleCalcExpression(expression, pool) {
  const resolvedExpression = expression.replace(/var\(--([a-z0-9-]+)\)/g, (_, name) => {
    const value = pool[name];
    return typeof value === 'number' ? String(value) : '0';
  });

  const normalized = resolvedExpression.replace(/\s+/g, '');

  if (!/^[-+*/().0-9]+$/.test(normalized)) {
    return undefined;
  }

  try {
    const result = Function(`"use strict"; return (${normalized})`)();
    return typeof result === 'number' && Number.isFinite(result) ? formatResolvedNumber(result) : undefined;
  } catch {
    return undefined;
  }
}

function resolveScaleSemanticValue(raw, pool, depth = 0) {
  if (depth > 12) {
    return raw;
  }

  const trimmed = String(raw).trim();
  const pureVar = /^var\(--([a-z0-9-]+)\)$/.exec(trimmed);

  if (pureVar) {
    const resolved = pool[pureVar[1]];
    return typeof resolved === 'number' ? resolved : trimmed;
  }

  if (trimmed.startsWith('calc(') && trimmed.endsWith(')')) {
    return evaluateScaleCalcExpression(trimmed.slice(5, -1), pool) ?? trimmed;
  }

  if (trimmed.endsWith('px')) {
    return Number.parseFloat(trimmed);
  }

  return trimmed;
}

function flattenScaleSemantic(semanticSpec, baseSpec) {
  const pool = buildScaleResolvedPool(baseSpec);
  const out = {};

  for (const group of semanticSpec.groups ?? []) {
    for (const token of group.tokens) {
      out[token.name] = resolveScaleSemanticValue(token.value, pool);
    }
  }

  return out;
}

function flattenScaleBase(baseSpec) {
  const out = {};
  for (const [name, value] of Object.entries(baseSpec.scale ?? {})) {
    out[name] = typeof value === 'number' ? value : value;
  }
  return out;
}

function flattenTypographyBase(baseSpec) {
  const out = {};
  for (const group of baseSpec.groups ?? []) {
    for (const [key, value] of Object.entries(group.tokens ?? {})) {
      out[key] = value.endsWith('px') ? Number.parseFloat(value) : value;
    }
  }
  return out;
}

function flattenTypographySemantic(semanticSpec) {
  const out = {};
  for (const group of semanticSpec.groups ?? []) {
    for (const token of group.tokens ?? []) {
      if (typeof token === 'object' && token.name && token.value) {
        out[token.name] = token.value;
      }
    }
    for (const [key, value] of Object.entries(group.tokens ?? {})) {
      if (typeof value === 'string') out[key] = value;
    }
  }
  return out;
}

function parseBaseMotion(baseSpec) {
  const springs = {};
  for (const [name, spring] of Object.entries(baseSpec.springs ?? {})) {
    if (spring.reanimated) {
      springs[`ios-spring-${name}`] = spring.reanimated;
    }
  }
  const timings = {};
  for (const [name, timing] of Object.entries(baseSpec.timings ?? {})) {
    timings[`ios-${name.replace(/([A-Z])/g, '-$1').toLowerCase()}`] = {
      duration: timing.duration,
      easing: `cubic-bezier(${timing.easing.join(',')})`,
    };
  }
  const scale = {};
  const opacity = {};
  for (const group of baseSpec.groups ?? []) {
    for (const token of group.tokenList ?? []) {
      const key = token.name.replace(/^motion-/, '');
      const numeric = Number.parseFloat(String(token.value));
      if (token.name.includes('opacity')) {
        opacity[key] = numeric;
      } else if (token.name.includes('scale')) {
        scale[key] = numeric;
      }
    }
  }
  return { springs, timings, scale, opacity };
}

function parseNumericTokenValue(value) {
  const parsed = Number.parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : value;
}

function flattenEffectGlassTokens(effectBaseSpec) {
  const out = {};
  for (const group of effectBaseSpec.groups ?? []) {
    for (const token of group.tokens ?? []) {
      if (!token.name.startsWith('eds-glass-')) {
        continue;
      }
      const key = token.name.replace(/^eds-glass-/, '');
      if (typeof token.value === 'string' && token.value.endsWith('px')) {
        out[key] = Number.parseFloat(token.value);
        continue;
      }
      if (typeof token.value === 'string' && token.value.endsWith('%')) {
        out[key] = Number.parseFloat(token.value) / 100;
        continue;
      }
      out[key] = parseNumericTokenValue(token.value);
    }
  }
  return out;
}

function buildGlassSurfaceRn(surfaceSpec) {
  const variants = {};
  for (const [name, preset] of Object.entries(surfaceSpec.variants ?? {})) {
    variants[name] = {};
    for (const [key, value] of Object.entries(preset)) {
      if (typeof value === 'string' && value.startsWith('var(--eds-glass-')) {
        const ref = value.replace(/^var\(--eds-glass-([^)]+)\)$/, '$1');
        variants[name][key] = { ref: `effect.${ref}` };
        continue;
      }
      if (typeof value === 'string' && value.startsWith('var(--eds-shadow-')) {
        variants[name][key] = value;
        continue;
      }
      variants[name][key] = parseNumericTokenValue(value);
    }
  }

  return {
    variants,
    shapes: surfaceSpec.shapes ?? {},
    container: surfaceSpec.container ?? {},
  };
}

function buildTagPaletteRn(tagPalette) {
  const tags = {};
  for (const groupKey of ['mobileColor', 'mobileStatus', 'status', 'colorful', 'custom']) {
    tags[groupKey] = {};
    for (const [key, themeValues] of Object.entries(tagPalette[groupKey] ?? {})) {
      tags[groupKey][key] = {
        light: { ...themeValues.light },
        dark: { ...themeValues.dark },
      };
    }
  }
  return tags;
}

/**
 * RN cannot synthesize weights for bundled fonts, so each weight is addressed by
 * its own family name. Web declares the same names, which is what keeps the
 * browser preview resolving the exact face the device loads.
 */
function buildFonts(fontsSpec) {
  const byRole = {};
  const faces = [];

  for (const family of fontsSpec.families ?? []) {
    const weights = {};
    for (const face of family.faces ?? []) {
      weights[String(face.weight)] = face.family;
      faces.push({ family: face.family, file: face.file, weight: face.weight });
    }
    byRole[family.role] = { stackName: family.name, weights };
  }

  return { ...byRole, faces };
}

/**
 * Metro can only resolve static require paths, so the asset map is generated
 * rather than derived at runtime. Metro-only entry point — web bundlers must
 * import the CSS faces instead.
 */
function writeRnFontAssets(jsDir, faces) {
  const entries = faces
    .map((face) => `  '${face.family}': require('../assets/fonts/${face.file}'),`)
    .join('\n');

  writeFileSync(
    join(jsDir, 'fonts-native.js'),
    `/** Auto-generated — do not edit. Source: packages/tokens/spec/typography/fonts.json */\n` +
      `export const edsFontAssets = {\n${entries}\n};\nexport default edsFontAssets;\n`,
  );

  writeFileSync(
    join(jsDir, 'fonts-native.d.ts'),
    `/** Auto-generated — do not edit. */\nexport declare const edsFontAssets: Record<string, number>;\nexport default edsFontAssets;\n`,
  );
}

export function buildRnTheme({ specDir, distDir }) {
  const colorBase = loadJson(specDir, 'color/base.json');
  const colorSemantic = loadJson(specDir, 'color/semantic.json');
  const tagPalette = loadJson(specDir, 'color/tag-palette.json');
  const scaleSemantic = loadJson(specDir, 'scale/semantic.json');
  const scaleBase = loadJson(specDir, 'scale/base.json');
  const typographyBase = loadJson(specDir, 'typography/base.json');
  const typographySemantic = loadJson(specDir, 'typography/semantic.json');
  const motionBase = loadJson(specDir, 'motion/base.json');
  const effectBase = loadJson(specDir, 'effect/base.json');
  const effectSemantic = loadJson(specDir, 'effect/semantic.json');
  const glassSurfaceSpec = loadJson(specDir, 'liquid-glass/surface.json');
  const fontsSpec = loadJson(specDir, 'typography/fonts.json');

  const colors = { light: {}, dark: {} };
  for (const theme of ['light', 'dark']) {
    for (const [name, entry] of Object.entries(colorBase[theme])) {
      colors[theme][name.replace(/^eds-/, '')] = entry.hex;
    }
    for (const token of colorSemantic.tokens) {
      colors[theme][token.name] = resolveSemanticColorToHex(token[theme], theme, colorBase);
    }
  }

  const theme = {
    colors,
    spacing: flattenScaleSemantic(scaleSemantic, scaleBase),
    scale: flattenScaleBase(scaleBase),
    typography: {
      base: flattenTypographyBase(typographyBase),
      semantic: flattenTypographySemantic(typographySemantic),
    },
    fonts: buildFonts(fontsSpec),
    motion: parseBaseMotion(motionBase),
    glass: {
      effect: flattenEffectGlassTokens(effectBase),
      surface: buildGlassSurfaceRn(glassSurfaceSpec),
      boxes: buildGlassBoxCompositions({
        effectSemanticSpec: effectSemantic,
        effectBaseSpec: effectBase,
        scaleSemanticSpec: scaleSemantic,
        scaleBaseSpec: scaleBase,
        colorBaseSpec: colorBase,
        colorSemanticSpec: colorSemantic,
      }),
    },
    tags: buildTagPaletteRn(tagPalette),
  };

  const jsDir = join(distDir, 'js');
  mkdirSync(jsDir, { recursive: true });

  const jsBody = `/** Auto-generated — do not edit. Source: packages/tokens/spec */\nexport const mobileTheme = ${JSON.stringify(theme, null, 2)};\nexport default mobileTheme;\n`;
  writeFileSync(join(jsDir, 'theme.js'), jsBody);

  const dts = `/** Auto-generated — do not edit. */\nexport type MobileThemeColors = Record<string, string>;\nexport type MobileFontRole = { stackName: string; weights: Record<string, string> };\nexport type MobileFontFace = { family: string; file: string; weight: number };\nexport type MobileTagPaletteEntry = { light: Record<string, string>; dark: Record<string, string> };\nexport type MobileTheme = {\n  colors: { light: MobileThemeColors; dark: MobileThemeColors };\n  spacing: Record<string, number | string>;\n  scale: Record<string, number | string>;\n  typography: { base: Record<string, number | string>; semantic: Record<string, string> };\n  fonts: { sans: MobileFontRole; mono: MobileFontRole; faces: MobileFontFace[] };\n  motion: {\n    springs: Record<string, Record<string, number>>;\n    timings: Record<string, { duration?: number; easing?: string }>;\n    scale: Record<string, number>;\n    opacity: Record<string, number>;\n  };\n  tags: Record<string, Record<string, MobileTagPaletteEntry>>;\n  glass: {\n    effect: Record<string, number | string>;\n    surface: {\n      variants: Record<string, Record<string, unknown>>;\n      shapes: Record<string, string>;\n      container: Record<string, string>;\n    };\n    boxes: Record<string, { title?: string; className: string; light: Record<string, unknown>; dark: Record<string, unknown> }>;\n  };\n};\nexport declare const mobileTheme: MobileTheme;\nexport default mobileTheme;\n`;
  writeFileSync(join(jsDir, 'theme.d.ts'), dts);

  writeRnFontAssets(jsDir, theme.fonts.faces);

  console.log('✓ RN theme exported to dist/js/theme.js');
}
