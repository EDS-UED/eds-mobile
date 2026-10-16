import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, writeFileSync, rmSync, copyFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { verifyColorSpecAgainstDist } from './verify-color-spec.mjs';
import { buildRnTheme } from './build-rn-theme.mjs';
import { mapColorTokenValue } from './color-reference.mjs';
import {
  writeMotionCatalogJson,
  generateMobileMotionRuntime,
} from './motion-build.mjs';
import { buildGlassBoxCompositions } from './resolve-effect-glass-box.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const specDir = join(rootDir, 'spec');
const distDir = join(rootDir, 'dist');
const cssDir = join(distDir, 'css');

function loadJson(relativePath) {
  return JSON.parse(readFileSync(join(specDir, relativePath), 'utf-8'));
}

function mapEntriesToVariables(entries) {
  return Object.entries(entries)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, value]) => ({ name, value }));
}

function appendCssCommentBlock(lines, commentLines, indent = '  ') {
  if (!commentLines?.length) {
    return;
  }

  if (commentLines.length === 1) {
    lines.push(`${indent}/* ${commentLines[0]} */`);
    return;
  }

  lines.push(`${indent}/* ${commentLines[0]}`);
  for (const line of commentLines.slice(1)) {
    const normalized = line.startsWith('*') ? line : `* ${line}`;
    lines.push(`${indent}   ${normalized}`);
  }
  lines.push(`${indent}   */`);
}

/** Primitives@Cregis — Figma Color System base order (node 2008:41). */
const COLOR_BASE_ORDER = [
  'eds-brand',
  'eds-match',
  'eds-decor',
  'eds-success',
  'eds-danger',
  'eds-warning',
  'eds-base',
  'eds-face',
  'eds-same-black',
  'eds-same-white',
  'eds-page',
  'eds-flotation',
  'eds-overlay',
];

const COLOR_SEMANTIC_GROUP_ORDER = [
  { prefix: 'box', comment: '容器（Box）' },
  { prefix: 'stroke', comment: '线（Stroke）' },
  { prefix: 'text', comment: '文本（Text）' },
  { prefix: 'material', comment: '材质（Material）' },
  { prefix: 'status', comment: '状态（Status）' },
  { prefix: 'effect', comment: '特效（Effect）' },
  { prefix: 'event', comment: '交互状态（Event）' },
  { prefix: 'data-table', comment: '表格（Data Table）' },
];

const TAG_SEMANTIC_GROUP_ORDER = [
  { prefix: 'tag-status', comment: '标签状态（Tag Status）' },
  { prefix: 'tag-colorful', comment: '彩色标签（Tag Colorful）' },
  { prefix: 'tag-custom', comment: '自定义标签（Tag Custom）' },
];

function groupTagSemanticTokens(tokens) {
  return groupColorSemanticTokensWithOrder(tokens, TAG_SEMANTIC_GROUP_ORDER, 'Tag');
}

function groupColorSemanticTokensWithOrder(tokens, groupOrder, remainingComment = 'Status') {
  const assigned = new Set();

  const groups = groupOrder
    .map(({ prefix, comment }) => {
      const groupTokens = tokens.filter((token) => {
        if (assigned.has(token.name)) {
          return false;
        }

        const matches =
          prefix === 'data-table'
            ? token.name.startsWith('data-table')
            : token.name.startsWith(`${prefix}-`);

        if (matches) {
          assigned.add(token.name);
        }

        return matches;
      });

      return { comment, tokens: groupTokens };
    })
    .filter((group) => group.tokens.length > 0);

  const remaining = tokens.filter((token) => !assigned.has(token.name));
  if (remaining.length > 0) {
    groups.push({ comment: remainingComment, tokens: remaining });
  }

  return groups;
}

function groupColorSemanticTokens(tokens) {
  return groupColorSemanticTokensWithOrder(tokens, COLOR_SEMANTIC_GROUP_ORDER);
}

function flattenScaleSemanticTokens(semanticSpec) {
  return (semanticSpec.groups ?? []).flatMap((group) => group.tokens);
}

function resolveScaleBaseUnit(baseSpec) {
  return baseSpec.scaleBase ?? baseSpec.controlBase ?? 4;
}

function buildScaleBaseVariables(baseSpec) {
  const unit = resolveScaleBaseUnit(baseSpec);
  const scaleVars = [{ name: 'scale-base', value: `${unit}px` }];

  for (const [name, entry] of Object.entries(baseSpec.scale)) {
    if (typeof entry === 'number') {
      scaleVars.push({
        name,
        value: `calc(${entry} * var(--scale-base))`,
        comment: `${entry} × ${unit}px`,
      });
      continue;
    }

    scaleVars.push({ name, value: entry });
  }

  return { unit, scaleVars };
}

function writeScaleBaseCssFile(destination, selector, baseSpec, headerLines = []) {
  const { unit, scaleVars } = buildScaleBaseVariables(baseSpec);
  const lines = [
    '/**',
    ' * Do not edit directly, this file was auto-generated from Figma tokens.',
    ...headerLines.map((line) => (line.startsWith(' *') ? line : ` * ${line}`)),
    ' */',
    '',
    `${selector} {`,
    '',
    '  /* 基数（Primitive） */',
    `  --scale-base: ${unit}px;`,
    '',
    '  /* 原始尺度引擎（Primitive Scale Engine） */',
  ];

  for (const token of scaleVars.slice(1)) {
    if (token.comment) {
      const declaration = `  --${token.name}: ${token.value};`;
      const padding = Math.max(1, 34 - declaration.length);
      lines.push(`${declaration}${' '.repeat(padding)}/* ${token.comment} */`);
      continue;
    }

    lines.push(`  --${token.name}: ${token.value};`);
  }

  lines.push('}', '');

  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, lines.join('\n'));
}

function formatScaleSemanticLine(token) {
  const declaration = `  --${token.name}: ${token.value};`;
  if (!token.comment) {
    return declaration;
  }

  const padding = Math.max(1, 34 - declaration.length);
  return `${declaration}${' '.repeat(padding)}/* ${token.comment} */`;
}

function writeScaleSemanticCssFile(destination, selector, groups, headerLines = []) {
  const lines = [
    '/**',
    ' * Do not edit directly, this file was auto-generated from Figma tokens.',
    ...headerLines.map((line) => (line.startsWith(' *') ? line : ` * ${line}`)),
    ' */',
    '',
    `${selector} {`,
  ];

  for (const group of groups) {
    lines.push('');
    lines.push(`  /* ${group.comment} */`);
    for (const token of group.tokens) {
      lines.push(formatScaleSemanticLine(token));
    }
  }

  lines.push('}', '');

  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, lines.join('\n'));
}

function flattenGroupedSemanticTokens(spec) {
  return (spec.groups ?? []).flatMap((group) => group.tokens);
}

function flattenTypographyBasePool(baseSpec) {
  const pool = {};
  for (const group of baseSpec.groups ?? []) {
    for (const [name, value] of Object.entries(group.tokens ?? {})) {
      pool[name] = value;
    }
  }
  return pool;
}

function resolveCssVarReference(value, pool) {
  if (typeof value !== 'string') {
    return value;
  }

  const match = value.match(/^var\(--([a-z0-9-]+)\)$/i);
  if (!match) {
    return value;
  }

  const next = pool[match[1]];
  if (next === undefined) {
    return value;
  }

  if (typeof next === 'string' && next.startsWith('var(')) {
    return resolveCssVarReference(next, pool);
  }

  return next;
}

/** Inline comment for dist CSS — resolved literal after var(--*) chain. */
function cssVarValueComment(value, pool) {
  const resolved = resolveCssVarReference(value, pool);
  if (resolved === value || resolved === undefined || resolved === '') {
    return '';
  }

  return ` /* ${resolved} */`;
}

function writeTypographyBaseCssFile(destination, selector, baseSpec, headerLines = []) {
  const lines = [
    '/**',
    ' * Do not edit directly, this file was auto-generated from Figma tokens.',
    ...headerLines.map((line) => (line.startsWith(' *') ? line : ` * ${line}`)),
    ' */',
    '',
    `${selector} {`,
    '',
    '  /* ---- 原始字体排印令牌（Primitive Tokens） ---- */',
  ];

  for (const group of baseSpec.groups) {
    lines.push(`  /* ${group.comment} */`);
    for (const [name, value] of Object.entries(group.tokens)) {
      lines.push(`  --${name}: ${value};`);
    }
    lines.push('');
  }

  lines.push('}', '');

  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, lines.join('\n'));
}

function writeTypographySemanticCssFile(
  destination,
  selector,
  semanticSpec,
  textStylesSpec,
  baseSpec,
  headerLines = [],
) {
  const basePool = flattenTypographyBasePool(baseSpec);
  const semanticPool = { ...basePool };

  const lines = [
    '/**',
    ' * Do not edit directly, this file was auto-generated from Figma tokens.',
    ...headerLines.map((line) => (line.startsWith(' *') ? line : ` * ${line}`)),
    ' */',
    '',
    `${selector} {`,
  ];

  for (const group of semanticSpec.groups) {
    lines.push('');
    lines.push(`  /* ${group.comment} */`);
    for (const token of group.tokens) {
      semanticPool[token.name] = token.value;
      const comment = cssVarValueComment(token.value, basePool);
      lines.push(`  --${token.name}: ${token.value};${comment}`);
    }
  }

  lines.push('}', '');
  appendTextStyleClassLines(lines, textStylesSpec, semanticPool);

  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, lines.join('\n'));
}

function writeTypographyGlobalCssFile(destination, globalSpec, headerLines = []) {
  const lines = [
    '/**',
    ' * Do not edit directly, this file was auto-generated from Figma tokens.',
    ...headerLines.map((line) => (line.startsWith(' *') ? line : ` * ${line}`)),
    ' */',
    '',
    '/* ---- 全局字体家族 ---- */',
    `${globalSpec.selector} {`,
  ];

  for (const [property, value] of Object.entries(globalSpec.properties)) {
    lines.push(`  ${property}: ${value};`);
  }

  lines.push('}', '');

  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, lines.join('\n'));
}

function writeBarSubpixelCssFile(destination, spec, headerLines = []) {
  const lines = [
    '/**',
    ' * Do not edit directly, this file was auto-generated from Figma tokens.',
    ...headerLines.map((line) => (line.startsWith(' *') ? line : ` * ${line}`)),
    ' */',
    '',
    `.${spec.className} {`,
  ];

  for (const [property, value] of Object.entries(spec.properties)) {
    lines.push(`  ${property}: ${value};`);
  }

  lines.push('}', '');

  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, lines.join('\n'));
}

function appendTextStyleClassLines(lines, stylesSpec, tokenPool = {}) {
  lines.push('/* ---- Text Styles（Figma Text Styles） ---- */');
  lines.push('');

  for (const style of stylesSpec.styles ?? []) {
    lines.push(`.${style.className} {`);

    for (const [property, value] of Object.entries(style.properties ?? {})) {
      const comment = cssVarValueComment(value, tokenPool);
      lines.push(`  ${property}: ${value};${comment}`);
    }

    lines.push('}', '');
  }
}

function writeTextStylesCssFile(destination, stylesSpec, headerLines = []) {
  const lines = [
    '/**',
    ' * Do not edit directly, this file was auto-generated from Figma tokens.',
    ...headerLines.map((line) => (line.startsWith(' *') ? line : ` * ${line}`)),
    ' */',
    '',
  ];

  appendTextStyleClassLines(lines, stylesSpec);

  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, lines.join('\n'));
}

function formatEffectLayers(layers) {
  return layers.join(', ');
}

function appendEffectGroupTokens(lines, groups) {
  for (const group of groups) {
    lines.push('');
    lines.push('  /* ========================================');
    lines.push(`     ${group.comment}`);
    lines.push('     ======================================== */');
    lines.push('');

    for (const token of group.tokens) {
      if (token.title) {
        lines.push(`  /* ${token.title} */`);
      }

      if (token.placeholder || (!token.layers && !token.value && !token.glowLayers?.length)) {
        appendCssCommentBlock(lines, token.implementationNotes ?? []);
        if (token.note) {
          appendCssCommentBlock(lines, [token.note]);
        }
        appendCssCommentBlock(lines, token.usageNotes ?? []);
        lines.push('');
        continue;
      }

      const value = token.layers ? formatEffectLayers(token.layers) : token.value;

      if (token.glowLayers?.length) {
        const blendMode = token.glowBlendMode ?? 'plus-darker';
        const normalLayerCount = token.layers?.length ?? 0;
        const pseudoElement = token.glowPseudo ?? (token.glowOnly ? '::before' : '::after');

        if (token.glowOnly || normalLayerCount === 0) {
          lines.push(
            `  /* Figma 共 ${token.glowLayers.length} 层：全部 ${blendMode}（${pseudoElement} + mix-blend-mode） */`,
          );
        } else {
          lines.push(
            `  /* Figma 共 ${token.glowLayers.length + normalLayerCount} 层：第 1–${token.glowLayers.length} 层 ${blendMode}（${pseudoElement} + mix-blend-mode） */`,
          );
          lines.push(`  /* 第 ${token.glowLayers.length + 1} 层起：Normal */`);
        }

        lines.push(`  --${token.name}-glow: ${formatEffectLayers(token.glowLayers)};`);
        lines.push(`  --${token.name}-glow-blend-mode: ${blendMode};`);
      }

      if (token.glowOnly) {
        lines.push(`  --${token.name}: var(--${token.name}-glow);`);
      } else if (token.layers) {
        lines.push(`  --${token.name}: ${value};`);
      } else if (token.value) {
        lines.push(`  --${token.name}: ${value};`);
      }
      appendCssCommentBlock(lines, token.usageNotes ?? []);
      lines.push('');
    }
  }
}

function writeLiquidGlassRendererJson(destination, liquidGlassSpec) {
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, `${JSON.stringify(liquidGlassSpec, null, 2)}\n`);
}

function writeEffectThemeBaseCssFile(destination, selector, themeName, baseSpec, headerLines = []) {
  const lines = [
    '/**',
    ' * Do not edit directly, this file was auto-generated from Figma tokens.',
    ...headerLines.map((line) => (line.startsWith(' *') ? line : ` * ${line}`)),
    ' * Color primitives reference var(--eds-*) from the matching color theme.',
    ' */',
    '',
    `${selector} {`,
  ];

  const themeColors = baseSpec.colors?.[themeName];
  if (themeColors && Object.keys(themeColors).length > 0) {
    lines.push('  /* Effect 色 primitive（引用 color 基色） */');
    for (const [name, value] of Object.entries(themeColors)) {
      lines.push(`  --${name}: ${mapColorTokenValue(value)};`);
    }
  }

  appendEffectGroupTokens(lines, baseSpec.groups);
  lines.push('}', '');

  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, lines.join('\n'));
}

function writeEffectReadyCssFile(destination, headerLines = []) {
  const lines = [
    '/**',
    ' * Do not edit directly, this file was auto-generated from Figma tokens.',
    ...headerLines.map((line) => (line.startsWith(' *') ? line : ` * ${line}`)),
    ' */',
    '',
    '[data-liquid-glass-ready] {',
    '  /* backdrop-filter 由 initLiquidGlass() 按元素尺寸注入 SVG filter url */',
    '}',
    '',
  ];

  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, lines.join('\n'));
}

function writeLiquidGlassArchitectureCssFile(destination, systemSpec) {
  const lines = [
    '/**',
    ' * Do not edit directly, this file was auto-generated from Figma tokens.',
    ' * Liquid Glass — 玻璃材质栈（架构说明，非独立 Figma 色板）。',
    ' * Source: spec/liquid-glass/system.json',
    ' *',
    ` * ${systemSpec.architectureSummary}`,
    ' */',
    '',
    `/* ${systemSpec.conceptTitle ?? '液态玻璃'} */`,
    '',
  ];

  const architectureNodes = [
    ...(systemSpec.trunk ?? []),
    ...(systemSpec.stacks ?? []),
    ...(systemSpec.platformSplit?.branches ?? []).map((branch) => ({
      ...branch,
      label: branch.label ?? systemSpec.platformSplit?.label,
    })),
  ];

  if (architectureNodes.length > 0) {
    for (const node of architectureNodes) {
      const section = node.label ? `${node.label} — ` : '';
      lines.push(`/* ${section}${node.primary} — ${node.secondary} */`);
    }
  } else {
    for (const layer of systemSpec.layers ?? []) {
      const label = layer.primary ?? layer.title;
      const hint = layer.secondary ?? layer.detail;
      lines.push(`/* ${label} — ${hint} */`);
    }
  }

  lines.push(
    '',
    '/* 关联 CSS 入口（完整 @import 见 dist/css/index.css）： */',
    `/* · ${systemSpec.cssImports?.effect ?? '../effect/index.css'} */`,
    `/* · ${systemSpec.cssImports?.liquidGlass ?? '../liquid-glass/index.css'} */`,
    '',
  );

  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, lines.join('\n'));
}

function buildLiquidGlassCssSystem() {
  const systemSpec = loadJson('liquid-glass/system.json');
  const liquidGlassSpec = loadJson('effect/liquid-glass.json');
  const liquidGlassDir = join(cssDir, 'liquid-glass');

  writeLiquidGlassArchitectureCssFile(join(liquidGlassDir, 'architecture.css'), systemSpec);

  writeEffectReadyCssFile(join(liquidGlassDir, 'ready.css'), [
    ' * Liquid Glass — Web ready hook（initLiquidGlass / attachLiquidGlass）。',
    ' * Source: spec/effect/liquid-glass.json, packages/tokens/src/liquid-glass.js',
  ]);

  writeLiquidGlassRendererJson(
    join(distDir, 'json/liquid-glass/renderer.json'),
    liquidGlassSpec,
  );

  writeFileSync(
    join(distDir, 'json/liquid-glass/system.json'),
    `${JSON.stringify(systemSpec, null, 2)}\n`,
  );

  const surfaceSpec = loadJson('liquid-glass/surface.json');
  writeFileSync(
    join(distDir, 'json/liquid-glass/surface.json'),
    `${JSON.stringify(surfaceSpec, null, 2)}\n`,
  );

  buildLiquidGlassAssets();

  writeImportAggregator(
    join(liquidGlassDir, 'index.css'),
    ['./architecture.css', './ready.css'],
    'Liquid Glass — glass material stack (architecture + Web ready hook)',
  );
}

function buildLiquidGlassAssets() {
  const source = join(rootDir, 'src/liquid-glass.js');
  const destination = join(distDir, 'js/liquid-glass.js');
  mkdirSync(dirname(destination), { recursive: true });
  copyFileSync(source, destination);
}

async function buildCornerSmoothingAssets() {
  const esbuild = await import('esbuild');
  const destination = join(distDir, 'js/corner-smoothing.js');
  mkdirSync(dirname(destination), { recursive: true });

  await esbuild.build({
    entryPoints: [join(rootDir, 'src/corner-smoothing.js')],
    outfile: destination,
    bundle: true,
    format: 'esm',
    platform: 'browser',
    target: 'es2022',
  });

  console.log('✓ Corner smoothing bundled to dist/js/corner-smoothing.js');
}

function effectThemeSelector(themeName) {
  return `[data-theme="${themeName}"]`;
}

function buildEffectSemanticClassSelector(themeName, className, pseudo = '') {
  return `[data-theme="${themeName}"] .${className}${pseudo}`;
}

function findEffectToken(baseSpec, name) {
  for (const group of baseSpec.groups ?? []) {
    const token = group.tokens?.find((entry) => entry.name === name);
    if (token) {
      return token;
    }
  }

  return null;
}

function applyShadowStack(style, baseSpec, options = {}) {
  if (!style.shadowStack) {
    return style;
  }

  const token = findEffectToken(baseSpec, style.shadowStack);
  if (!token?.glowLayers?.length) {
    throw new Error(`Unknown effect shadowStack token: ${style.shadowStack}`);
  }

  const properties = { ...(style.properties ?? {}) };
  const pseudo = { ...(style.pseudo ?? {}) };

  properties.position = properties.position ?? 'relative';
  properties.isolation = properties.isolation ?? 'isolate';
  properties.overflow = properties.overflow ?? 'visible';
  properties['box-shadow'] = `var(--${token.name})`;

  pseudo['::after'] = {
    content: "''",
    position: 'absolute',
    inset: '0',
    'z-index': '0',
    'border-radius': 'inherit',
    'box-shadow': `var(--${token.name}-glow)`,
    'mix-blend-mode': 'plus-darker',
    '-webkit-mix-blend-mode': 'plus-darker',
    'pointer-events': 'none',
    ...pseudo['::after'],
  };

  if (options.skipChild) {
    return { ...style, properties, pseudo };
  }

  const hasBefore = Boolean(pseudo['::before']);
  const child = style.child ?? {
    selector: '> *',
    properties: {
      position: 'relative',
      'z-index': hasBefore ? '2' : '1',
    },
  };

  if (hasBefore && child.properties?.['z-index'] === '1') {
    child.properties = { ...child.properties, 'z-index': '2' };
  }

  return { ...style, properties, pseudo, child };
}

function applyGlassStack(style, baseSpec, options = {}) {
  if (!style.glassStack) {
    return style;
  }

  const token = findEffectToken(baseSpec, style.glassStack);
  if (!token?.glowLayers?.length) {
    throw new Error(`Unknown effect glassStack token: ${style.glassStack}`);
  }

  const pseudo = { ...(style.pseudo ?? {}) };

  const shadowVar = token.glowOnly ? `var(--${token.name})` : `var(--${token.name}-glow)`;

  pseudo['::before'] = {
    content: "''",
    position: 'absolute',
    inset: '0',
    'z-index': '1',
    'border-radius': 'inherit',
    'box-shadow': shadowVar,
    'mix-blend-mode': 'plus-lighter',
    '-webkit-mix-blend-mode': 'plus-lighter',
    'pointer-events': 'none',
    ...pseudo['::before'],
  };

  if (options.skipChild) {
    return { ...style, pseudo };
  }

  const child = style.child ?? {
    selector: '> *',
    properties: {
      position: 'relative',
      'z-index': '2',
    },
  };

  if (child.properties?.['z-index'] === '1') {
    child.properties = { ...child.properties, 'z-index': '2' };
  }

  return { ...style, pseudo, child };
}

function resolveLayerStyle(baseStyle, layer, baseSpec) {
  let layerStyle = {
    className: `${baseStyle.className}${layer.suffix}`,
    properties: { ...(layer.properties ?? {}) },
    pseudo: { ...(layer.pseudo ?? {}) },
  };

  if (layer.shadowStack) {
    layerStyle = applyShadowStack(
      { ...layerStyle, shadowStack: layer.shadowStack },
      baseSpec,
      { skipChild: true },
    );
  }

  if (layer.glassStack) {
    layerStyle = applyGlassStack(
      { ...layerStyle, glassStack: layer.glassStack },
      baseSpec,
      { skipChild: true },
    );
  }

  return layerStyle;
}

function appendEffectStyleRules(lines, themeName, resolvedStyle, { includeNotes = false } = {}) {
  lines.push(`${buildEffectSemanticClassSelector(themeName, resolvedStyle.className)} {`);
  for (const [property, value] of Object.entries(resolvedStyle.properties ?? {})) {
    lines.push(`  ${property}: ${value};`);
  }

  if (includeNotes) {
    for (const note of resolvedStyle.notes ?? []) {
      lines.push(`  /* ${note} */`);
    }
  }

  lines.push('}', '');

  for (const [pseudo, properties] of Object.entries(resolvedStyle.pseudo ?? {})) {
    lines.push(`${buildEffectSemanticClassSelector(themeName, resolvedStyle.className, pseudo)} {`);
    for (const [property, value] of Object.entries(properties)) {
      lines.push(`  ${property}: ${value};`);
    }
    lines.push('}', '');
  }

  if (resolvedStyle.child) {
    const childSelector = resolvedStyle.child.selector ?? '> *';
    lines.push(
      `${buildEffectSemanticClassSelector(themeName, resolvedStyle.className)} ${childSelector} {`,
    );
    for (const [property, value] of Object.entries(resolvedStyle.child.properties ?? {})) {
      lines.push(`  ${property}: ${value};`);
    }
    lines.push('}', '');
  }
}

function appendLayeredComposition(lines, themeName, style, baseSpec) {
  if (style.title) {
    lines.push(`/* ${style.title} */`);
  }

  appendEffectStyleRules(
    lines,
    themeName,
    {
      className: style.className,
      properties: {
        position: 'relative',
        isolation: 'isolate',
        overflow: 'visible',
        ...(style.properties ?? {}),
      },
      notes: style.notes,
    },
    { includeNotes: true },
  );

  if (style.bgLayer) {
    appendEffectStyleRules(lines, themeName, {
      className: `${style.className}${style.bgLayer.suffix}`,
      properties: style.bgLayer.properties ?? {},
    });
    for (const layer of style.bgLayer.layers ?? []) {
      appendEffectStyleRules(lines, themeName, resolveLayerStyle(style, layer, baseSpec));
    }
  } else {
    for (const layer of style.layers ?? []) {
      appendEffectStyleRules(lines, themeName, resolveLayerStyle(style, layer, baseSpec));
    }
  }

  if (style.contentLayer) {
    appendEffectStyleRules(lines, themeName, {
      className: `${style.className}${style.contentLayer.suffix}`,
      properties: style.contentLayer.properties ?? {},
    });
  }
}

function formatShadowStackComment(token) {
  const blendMode = token.glowBlendMode ?? 'plus-darker';
  const normalLayerCount = token.layers?.length ?? 0;

  if (token.glowOnly || normalLayerCount === 0) {
    return `${token.title ?? token.name} — ${token.glowLayers.length} layers, all ${blendMode}`;
  }

  return `${token.title ?? token.name} — layers 1–${token.glowLayers.length} ${blendMode}, layer ${token.glowLayers.length + 1}+ Normal`;
}

function appendShadowStackUtilityClasses(lines, themeName, baseSpec) {
  lines.push('/* ========================================');
  lines.push('   Shadow Stack Utilities');
  lines.push('   ======================================== */');
  lines.push('');

  for (const group of baseSpec.groups ?? []) {
    for (const token of group.tokens ?? []) {
      if (!token.glowLayers?.length || token.glowOnly) {
        continue;
      }

      const className = `${token.name}-stack`;
      lines.push(`/* ${formatShadowStackComment(token)} */`);
      lines.push(`${buildEffectSemanticClassSelector(themeName, className)} {`);
      lines.push('  position: relative;');
      lines.push('  isolation: isolate;');
      lines.push('  overflow: visible;');
      lines.push(`  box-shadow: var(--${token.name});`);
      lines.push('}', '');

      lines.push(`${buildEffectSemanticClassSelector(themeName, className, '::after')} {`);
      lines.push("  content: '';");
      lines.push('  position: absolute;');
      lines.push('  inset: 0;');
      lines.push('  z-index: 0;');
      lines.push('  border-radius: inherit;');
      lines.push(`  box-shadow: var(--${token.name}-glow);`);
      lines.push(`  mix-blend-mode: plus-darker;`);
      lines.push(`  -webkit-mix-blend-mode: plus-darker;`);
      lines.push('  pointer-events: none;');
      lines.push('}', '');

      lines.push(`${buildEffectSemanticClassSelector(themeName, className)} > * {`);
      lines.push('  position: relative;');
      lines.push('  z-index: 1;');
      lines.push('}', '');
    }
  }
}

function appendGlassStackUtilityClasses(lines, themeName, baseSpec) {
  lines.push('/* ========================================');
  lines.push('   Glass Stack Utilities');
  lines.push('   ======================================== */');
  lines.push('');

  for (const group of baseSpec.groups ?? []) {
    for (const token of group.tokens ?? []) {
      if (!token.glowLayers?.length || !token.glowOnly) {
        continue;
      }

      const className = `${token.name}-stack`;
      lines.push(`/* ${formatShadowStackComment(token)} */`);
      lines.push(`${buildEffectSemanticClassSelector(themeName, className)} {`);
      lines.push('  position: relative;');
      lines.push('  isolation: isolate;');
      lines.push('  overflow: visible;');
      lines.push('}', '');

      lines.push(`${buildEffectSemanticClassSelector(themeName, className, '::before')} {`);
      lines.push("  content: '';");
      lines.push('  position: absolute;');
      lines.push('  inset: 0;');
      lines.push('  z-index: 1;');
      lines.push('  border-radius: inherit;');
      lines.push(`  box-shadow: var(--${token.name}-glow);`);
      lines.push(`  mix-blend-mode: plus-darker;`);
      lines.push(`  -webkit-mix-blend-mode: plus-darker;`);
      lines.push('  pointer-events: none;');
      lines.push('}', '');

      lines.push(`${buildEffectSemanticClassSelector(themeName, className)} > * {`);
      lines.push('  position: relative;');
      lines.push('  z-index: 2;');
      lines.push('}', '');
    }
  }
}

function writeEffectThemeSemanticCssFile(
  destination,
  themeName,
  semanticSpec,
  baseSpec,
  headerLines = [],
) {
  const lines = [
    '/**',
    ' * Do not edit directly, this file was auto-generated from Figma tokens.',
    ...headerLines.map((line) => (line.startsWith(' *') ? line : ` * ${line}`)),
    ' */',
    '',
  ];

  for (const group of semanticSpec.groups) {
    lines.push('/* ========================================');
    lines.push(`   ${group.comment}`);
    lines.push('   ======================================== */');
    lines.push('');

    for (const style of group.styles) {
      if (style.composition === 'layered') {
        appendLayeredComposition(lines, themeName, style, baseSpec);
        continue;
      }

      const resolvedStyle = applyGlassStack(applyShadowStack(style, baseSpec), baseSpec);

      if (resolvedStyle.title) {
        lines.push(`/* ${resolvedStyle.title} */`);
      }

      appendEffectStyleRules(lines, themeName, resolvedStyle, { includeNotes: true });
    }
  }

  appendShadowStackUtilityClasses(lines, themeName, baseSpec);
  appendGlassStackUtilityClasses(lines, themeName, baseSpec);

  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, lines.join('\n'));
}

function formatDisplayP3Component(value) {
  return Number(value.toFixed(4)).toString();
}

function hexToDisplayP3Components(hex) {
  const normalized = hex.replace('#', '');
  return [
    parseInt(normalized.slice(0, 2), 16) / 255,
    parseInt(normalized.slice(2, 4), 16) / 255,
    parseInt(normalized.slice(4, 6), 16) / 255,
  ];
}

function resolveColorBaseEntry(entry) {
  if (typeof entry === 'string') {
    return { hex: entry, displayP3: hexToDisplayP3Components(entry) };
  }

  if (entry.displayP3 == null && entry.hex) {
    return { ...entry, displayP3: hexToDisplayP3Components(entry.hex) };
  }

  return entry;
}

function buildTagBaseSpec(tagPalette) {
  const light = {};
  const dark = {};
  const tagGroupRoles = {
    status: ['bg', 'text'],
    colorful: ['bg', 'text'],
    custom: ['bg', 'text', 'bar'],
    mobileColor: ['bg', 'text', 'altBg'],
    mobileStatus: ['bg', 'text'],
  };

  for (const groupKey of Object.keys(tagGroupRoles)) {
    const roles = tagGroupRoles[groupKey];
    for (const [key, themeValues] of Object.entries(tagPalette[groupKey] ?? {})) {
      for (const role of roles) {
        const varName = `eds-tag-${groupKey}-${key}-${role}`;
        light[varName] = {
          hex: themeValues.light[role],
          displayP3: hexToDisplayP3Components(themeValues.light[role]),
        };
        dark[varName] = {
          hex: themeValues.dark[role],
          displayP3: hexToDisplayP3Components(themeValues.dark[role]),
        };
      }
    }
  }

  return { light, dark };
}

function expandTagPaletteSemanticTokens(tagPalette) {
  const tokens = [];
  const tagGroupRoles = {
    status: ['bg', 'text'],
    colorful: ['bg', 'text'],
    custom: ['bg', 'text', 'bar'],
    mobileColor: ['bg', 'text', 'altBg'],
    mobileStatus: ['bg', 'text'],
  };

  for (const groupKey of Object.keys(tagGroupRoles)) {
    const roles = tagGroupRoles[groupKey];
    for (const key of Object.keys(tagPalette[groupKey] ?? {})) {
      for (const role of roles) {
        const name = `tag-${groupKey}-${key}-${role}`;
        const reference = `color(var(--eds-${name}) / 1)`;
        tokens.push({ name, light: reference, dark: reference });
      }
    }
  }

  return tokens;
}

function formatColorBaseCssDeclarations(name, entry) {
  const { hex, displayP3 } = resolveColorBaseEntry(entry);
  const lines = [`  --${name}: ${hex};`];

  if (displayP3) {
    const [r, g, b] = displayP3;
    lines.push(
      `  --${name}: color(display-p3 ${formatDisplayP3Component(r)} ${formatDisplayP3Component(g)} ${formatDisplayP3Component(b)});`,
    );
  }

  return lines;
}

function orderedColorBaseEntries(themeEntries, order = null) {
  if (!order?.length) {
    return Object.entries(themeEntries).sort(([a], [b]) => a.localeCompare(b));
  }

  const remaining = new Map(Object.entries(themeEntries));
  const entries = [];

  for (const name of order) {
    const entry = remaining.get(name);
    if (entry) {
      entries.push([name, entry]);
      remaining.delete(name);
    }
  }

  for (const [name, entry] of remaining) {
    entries.push([name, entry]);
  }

  return entries;
}

function writeColorBaseCssFile(
  destination,
  selector,
  themeName,
  baseSpec,
  headerLines = [],
  order = null,
) {
  const lines = [
    '/**',
    ' * Do not edit directly, this file was auto-generated from Figma tokens.',
    ...headerLines.map((line) => (line.startsWith(' *') ? line : ` * ${line}`)),
    ' * Values: sRGB fallback + color(display-p3) from Figma node 2008:41.',
    ' */',
    '',
    `${selector} {`,
    '  /* 基色（Primitives@Cregis）— hex 为回退，下一行 display-p3 为正式值 */',
  ];

  for (const [name, entry] of orderedColorBaseEntries(baseSpec[themeName], order)) {
    lines.push(...formatColorBaseCssDeclarations(name, entry));
  }

  lines.push('}', '');

  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, lines.join('\n'));
}

function writeColorSemanticCssFile(destination, selector, groups, themeName, headerLines = []) {
  const lines = [
    '/**',
    ' * Do not edit directly, this file was auto-generated from Figma tokens.',
    ...headerLines.map((line) => (line.startsWith(' *') ? line : ` * ${line}`)),
    ' * Mapped with color-mix(in display-p3) referencing var(--eds-*).',
    ' */',
    '',
    `${selector} {`,
  ];

  for (const group of groups) {
    if (group.tokens.length === 0) {
      continue;
    }

    lines.push('');
    if (group.comment) {
      lines.push(`  /* ${group.comment} */`);
    }
    for (const token of group.tokens) {
      const comment = token.comment ? ` /* ${token.comment} */` : '';
      const mappedValue = mapColorTokenValue(token[themeName]);
      lines.push(`  --${token.name}: ${mappedValue};${comment}`);
    }
  }

  lines.push('}', '');

  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, lines.join('\n'));
}

function writeCssFile(destination, selector, variables, headerLines = []) {
  const lines = [
    '/**',
    ' * Do not edit directly, this file was auto-generated from Figma tokens.',
    ...headerLines.map((line) => (line.startsWith(' *') ? line : ` * ${line}`)),
    ' */',
    '',
    `${selector} {`,
  ];

  for (const variable of variables) {
    const comment = variable.description ? ` /** ${variable.description} */` : '';
    lines.push(`  --${variable.name}: ${variable.value};${comment}`);
  }

  lines.push('}', '');

  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, lines.join('\n'));
}

function writeImportAggregator(destination, imports, title) {
  const lines = [
    '/**',
    ` * ${title}`,
    ' * Do not edit directly, this file was auto-generated.',
    ' */',
    '',
    ...imports.map((file) => `@import '${file}';`),
    '',
  ];

  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, lines.join('\n'));
}

function themeSelector(themeName) {
  return themeName === 'light' ? ':root, [data-theme="light"]' : `[data-theme="${themeName}"]`;
}

function buildScaleSystem() {
  const baseSpec = loadJson('scale/base.json');
  const semanticSpec = loadJson('scale/semantic.json');

  writeScaleBaseCssFile(join(cssDir, 'scale/base.css'), ':root', baseSpec, [
    ' * Scale System — base primitives (基数).',
    ' * Source: spec/scale/base.json',
    ' * Formula: scale(n) = n × var(--scale-base).',
  ]);

  writeScaleSemanticCssFile(
    join(cssDir, 'scale/semantic.css'),
    ':root',
    semanticSpec.groups,
    [
      ' * Scale System — semantic mappings (语义尺度 → 基数).',
      ' * Source: spec/scale/semantic.json',
    ],
  );

  writeImportAggregator(
    join(cssDir, 'scale/index.css'),
    ['./base.css', './semantic.css'],
    'Scale System entry',
  );
}

function buildTypographyFonts() {
  const srcFontsDir = join(rootDir, 'assets/fonts');
  const distFontsDir = join(distDir, 'assets/fonts');
  mkdirSync(distFontsDir, { recursive: true });

  for (const fileName of readdirSync(srcFontsDir)) {
    if (!fileName.endsWith('.ttf')) continue;
    copyFileSync(join(srcFontsDir, fileName), join(distFontsDir, fileName));
  }

  const fontFamilies = JSON.parse(
    readFileSync(join(rootDir, 'spec/typography/fonts.json'), 'utf-8'),
  ).families;

  const lines = [
    '/**',
    ' * EDS Mobile — self-hosted UI + code fonts.',
    ' * Bundled via @eds/mobile-tokens (typography/index.css).',
    ' * Granular import: @eds/mobile-tokens/fonts',
    ' * Source: assets/fonts/EDSText-*.ttf, IBMPlexMono-*.ttf',
    ' */',
    '',
  ];

  for (const family of fontFamilies) {
    lines.push(`/* ${family.name} — ${family.comment} */`);
    for (const face of family.faces) {
      lines.push('@font-face {');
      lines.push(`  font-family: '${family.name}';`);
      lines.push('  font-style: normal;');
      lines.push(`  font-weight: ${face.weight};`);
      lines.push('  font-display: swap;');
      lines.push(`  src: url('../../assets/fonts/${face.file}') format('truetype');`);
      lines.push('}');
      lines.push('');
    }
  }

  /*
   * Per-weight families. React Native does not synthesize weights for bundled
   * fonts — Android resolves by exact family name — so RN surfaces must address
   * one family per face. Declaring the same names here keeps react-native-web
   * resolving the identical .ttf the device loads.
   */
  lines.push('/* Per-weight families — RN parity (browser resolves the same face as native). */');
  for (const family of fontFamilies) {
    for (const face of family.faces) {
      lines.push('@font-face {');
      lines.push(`  font-family: '${face.family}';`);
      lines.push('  font-style: normal;');
      lines.push(`  font-weight: ${face.weight};`);
      lines.push('  font-display: swap;');
      lines.push(`  src: url('../../assets/fonts/${face.file}') format('truetype');`);
      lines.push('}');
      lines.push('');
    }
  }

  mkdirSync(join(cssDir, 'typography'), { recursive: true });
  writeFileSync(join(cssDir, 'typography/fonts.css'), `${lines.join('\n')}\n`, 'utf-8');
}

function formatMotionSemanticLine(token) {
  const declaration = `  --${token.name}: ${token.value};`;
  if (!token.comment) {
    return declaration;
  }

  const padding = Math.max(1, 34 - declaration.length);
  return `${declaration}${' '.repeat(padding)}/* ${token.comment} */`;
}

function writeMotionBaseCssFile(destination, selector, baseSpec, headerLines = []) {
  const lines = [
    '/**',
    ' * Do not edit directly, this file was auto-generated from Figma tokens.',
    ...headerLines.map((line) => (line.startsWith(' *') ? line : ` * ${line}`)),
    ' */',
    '',
    `${selector} {`,
  ];

  for (const group of baseSpec.groups) {
    lines.push('');
    lines.push(`  /* ${group.comment} */`);
    if (group.tokenList?.length) {
      for (const token of group.tokenList) {
        lines.push(formatMotionSemanticLine(token));
      }
    } else if (group.tokens) {
      for (const [name, value] of Object.entries(group.tokens)) {
        lines.push(`  --${name}: ${value};`);
      }
    }
    if (group.usageNotes?.length) {
      appendCssCommentBlock(lines, group.usageNotes);
    }
  }

  if (baseSpec.springs) {
    lines.push('');
    lines.push('  /* Physics · Spring（Base 唯一真源） */');
    for (const [name, spring] of Object.entries(baseSpec.springs)) {
      lines.push(`  --motion-base-spring-${name}-response: ${spring.response};`);
      lines.push(`  --motion-base-spring-${name}-damping-fraction: ${spring.dampingFraction};`);
      lines.push(`  --motion-base-spring-${name}-blend-duration: ${spring.blendDuration}s;`);
      if (spring.reanimated) {
        const { damping, stiffness, mass } = spring.reanimated;
        lines.push(`  --ios-spring-${name}: damping:${damping},stiffness:${stiffness},mass:${mass};`);
      }
    }
  }

  if (baseSpec.haptics) {
    lines.push('');
    lines.push('  /* Haptic */');
    for (const [name, value] of Object.entries(baseSpec.haptics)) {
      lines.push(`  --motion-base-haptic-${name}: ${JSON.stringify(value)};`);
    }
  }

  if (baseSpec.timings) {
    lines.push('');
    lines.push('  /* Timing（RN withTiming 参考） */');
    for (const [name, timing] of Object.entries(baseSpec.timings)) {
      const easing = timing.easing.join(',');
      const cssName = name.replace(/([A-Z])/g, '-$1').toLowerCase();
      lines.push(`  --ios-${cssName}: duration:${timing.duration},easing:cubic-bezier(${easing});`);
    }
  }

  if (baseSpec.interaction) {
    lines.push('');
    lines.push('  /* Interaction defaults */');
    for (const [name, value] of Object.entries(baseSpec.interaction)) {
      const cssName = name.replace(/([A-Z])/g, '-$1').toLowerCase();
      lines.push(`  --motion-base-interaction-${cssName}: ${value ? 1 : 0};`);
    }
  }

  lines.push('}', '');

  if (baseSpec.reducedMotionOverrides?.length) {
    lines.push('@media (prefers-reduced-motion: reduce) {');
    lines.push(`  ${selector} {`);
    for (const token of baseSpec.reducedMotionOverrides) {
      lines.push(`    --${token.name}: ${token.value};`);
    }
    lines.push('  }');
    lines.push('}', '');
  }

  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, lines.join('\n'));
}

function appendMotionStyleBlock(lines, className, properties, notes = []) {
  for (const note of notes) {
    lines.push(`/* ${note} */`);
  }
  lines.push(`.${className} {`);
  for (const [property, value] of Object.entries(properties)) {
    lines.push(`  ${property}: ${value};`);
  }
  lines.push('}', '');
}

function appendMotionActiveStateBlock(lines, style) {
  if (!style.activeState || !Object.keys(style.activeState).length) {
    return;
  }

  const modifier = style.activeModifier ?? 'is-active';
  const selectors = [
    `.${style.className}.${modifier}`,
    ...(style.parentActiveSelectors ?? []).map((parentSelector) => `${parentSelector} .${style.className}`),
    ...(style.selfActiveSelectors ?? []).map((selfSelector) => `${selfSelector}.${style.className}`),
  ].join(',\n');

  lines.push(`${selectors} {`);
  for (const [property, value] of Object.entries(style.activeState)) {
    lines.push(`  ${property}: ${value};`);
  }
  lines.push('}', '');
}

function writeMotionSemanticCssFile(destination, semanticSpec, headerLines = []) {
  const lines = [
    '/**',
    ' * Do not edit directly, this file was auto-generated from Figma tokens.',
    ...headerLines.map((line) => (line.startsWith(' *') ? line : ` * ${line}`)),
    ' * Motion semantic — Tap / Layout / Flotation / Deform / Page (.motion-tap · .motion-layout · .motion-flotation · .motion-deform · .motion-page).',
    ' * Recipes: @eds/mobile-tokens/motion/recipe',
    ' */',
    '',
  ];

  for (const group of semanticSpec.groups ?? []) {
    lines.push('/* ========================================');
    lines.push(`   ${group.comment}`);
    lines.push('   ======================================== */');
    lines.push('');

    for (const style of group.styles ?? []) {
      if (style.title) {
        lines.push(`/* ${style.title} */`);
      }

      appendMotionStyleBlock(lines, style.className, style.properties ?? {}, style.notes ?? []);

      for (const pseudo of style.pseudoStyles ?? []) {
        const selectors = pseudo.selector
          .split(',')
          .map((part) => `.${style.className}${part.trim()}`)
          .join(',\n');
        lines.push(`${selectors} {`);
        for (const [property, value] of Object.entries(pseudo.properties)) {
          lines.push(`  ${property}: ${value};`);
        }
        lines.push('}', '');
      }

      appendMotionActiveStateBlock(lines, style);

      for (const stateStyle of style.stateStyles ?? []) {
        if (stateStyle.title) {
          lines.push(`/* ${stateStyle.title} */`);
        }

        appendMotionStyleBlock(
          lines,
          stateStyle.hostClass,
          stateStyle.properties ?? {},
          stateStyle.notes ?? [],
        );

        for (const pseudo of stateStyle.pseudoStyles ?? []) {
          const selectors = pseudo.selector
            .split(',')
            .map((part) => `.${stateStyle.hostClass}${part.trim()}`)
            .join(',\n');
          lines.push(`${selectors} {`);
          for (const [property, value] of Object.entries(pseudo.properties)) {
            lines.push(`  ${property}: ${value};`);
          }
          lines.push('}', '');
        }
      }
    }
  }

  const reducedClasses = semanticSpec.reducedMotionScenarioClasses ?? [];
  if (reducedClasses.length) {
    lines.push('/* ========================================');
    lines.push('   Reduced Motion');
    lines.push('   ======================================== */');
    lines.push('');
    lines.push('@media (prefers-reduced-motion: reduce) {');
    lines.push(`  ${reducedClasses.map((className) => `.${className}`).join(',\n  ')} {`);
    lines.push('    transition: none !important;');
    lines.push('  }');
    lines.push('}', '');
  }

  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, lines.join('\n'));
}

function writeMotionUtilitiesCssFile(destination, semanticSpec, headerLines = []) {
  const lines = [
    '/**',
    ' * Do not edit directly, this file was auto-generated from Figma tokens.',
    ...headerLines.map((line) => (line.startsWith(' *') ? line : ` * ${line}`)),
    ' */',
    '',
    '/* ========================================',
    '   Motion Utility Classes',
    '   ======================================== */',
    '',
  ];

  for (const utility of semanticSpec.utilityClasses ?? []) {
    if (utility.title) {
      lines.push(`/* ${utility.title} */`);
    }
    for (const note of utility.notes ?? []) {
      lines.push(`/* ${note} */`);
    }
    lines.push(`.${utility.className} {`);
    lines.push(`  transition: ${utility.standaloneTransition ?? 'none'};`);
    lines.push('}', '');
  }

  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, lines.join('\n'));
}

function buildMotionSystem() {
  const baseSpec = loadJson('motion/base.json');
  const recipeSpec = loadJson('motion/recipe.json');
  const semanticSpec = loadJson('motion/semantic.json');
  const selector = ':root, .mobileTokens';
  const animationsSrcDir = resolve(rootDir, '../animations/src');

  writeMotionBaseCssFile(join(cssDir, 'motion/base.css'), selector, baseSpec, [
    ' * Motion System — base primitives (duration, easing, physical state).',
    ' * Source: spec/motion/base.json',
  ]);

  writeMotionBaseCssFile(join(cssDir, 'motion/recipe.css'), selector, recipeSpec, [
    ' * Motion System — recipes (duration + easing + property).',
    ' * Source: spec/motion/recipe.json',
  ]);

  writeMotionSemanticCssFile(join(cssDir, 'motion/semantic.css'), semanticSpec, [
    ' * Motion System — semantic scenario classes (.motion-tap · .motion-page …).',
    ' * Source: spec/motion/semantic.json',
  ]);

  writeMotionUtilitiesCssFile(join(cssDir, 'motion/utilities.css'), semanticSpec, [
    ' * Motion System — utility classes.',
    ' * Source: spec/motion/semantic.json',
  ]);

  writeMotionCatalogJson(specDir, distDir);
  generateMobileMotionRuntime(specDir, animationsSrcDir);

  writeImportAggregator(
    join(cssDir, 'motion/index.css'),
    ['./base.css', './recipe.css', './semantic.css', './utilities.css'],
    'Motion CSS entry（同 Desktop — base · recipe · semantic · utilities）',
  );
}

function buildTypographySystem() {
  buildTypographyFonts();
  const baseSpec = loadJson('typography/base.json');
  const semanticSpec = loadJson('typography/semantic.json');
  const globalSpec = loadJson('typography/global.json');
  const codeGlobalSpec = loadJson('typography/code-global.json');
  const barSubpixelSpec = loadJson('typography/bar-subpixel.json');

  writeTypographyBaseCssFile(join(cssDir, 'typography/base.css'), ':root', baseSpec, [
    ' * Typography System — base primitives (原始字体排印令牌).',
    ' * Source: spec/typography/base.json',
  ]);

  const textStylesSpec = loadJson('text/styles.json');

  writeTypographySemanticCssFile(
    join(cssDir, 'typography/semantic.css'),
    ':root',
    semanticSpec,
    textStylesSpec,
    baseSpec,
    [
      ' * Typography System — semantic role tokens + Text Style classes.',
      ' * Source: spec/typography/semantic.json, spec/text/styles.json',
    ],
  );

  writeTypographyGlobalCssFile(join(cssDir, 'typography/global.css'), globalSpec, [
    ' * Typography System — global defaults.',
    ' * Source: spec/typography/global.json',
  ]);

  writeTypographyGlobalCssFile(join(cssDir, 'typography/code-global.css'), codeGlobalSpec, [
    ' * Typography System — code / monospace defaults.',
    ' * Source: spec/typography/code-global.json',
  ]);

  writeBarSubpixelCssFile(join(cssDir, 'typography/bar-subpixel.css'), barSubpixelSpec, [
    ' * Bar 11px subpixel utility (2× + scale 0.5).',
    ' * Source: spec/typography/bar-subpixel.json',
  ]);

  writeTextStylesCssFile(join(cssDir, 'text/styles.css'), textStylesSpec, [
    ' * Text Styles — Figma Text Style classes (subset of typography/semantic.css).',
    ' * Source: spec/text/styles.json',
  ]);

  writeImportAggregator(
    join(cssDir, 'typography/index.css'),
    [
      './fonts.css',
      './base.css',
      './semantic.css',
      './global.css',
      './code-global.css',
      './bar-subpixel.css',
    ],
    'Typography System entry',
  );

  writeImportAggregator(join(cssDir, 'text/index.css'), ['./styles.css'], 'Text Styles entry');
}

function buildEffectSystem() {
  const baseSpec = loadJson('effect/base.json');
  const semanticSpec = loadJson('effect/semantic.json');

  for (const themeName of ['light', 'dark']) {
    const selector = effectThemeSelector(themeName);
    const themeDir = join(cssDir, 'effect/themes', themeName);

    writeEffectThemeBaseCssFile(join(themeDir, 'base.css'), selector, themeName, baseSpec, [
      ` * Effect System — base tokens (${themeName}).`,
      ' * Source: spec/effect/base.json',
    ]);

    writeEffectThemeSemanticCssFile(
      join(themeDir, 'semantic.css'),
      themeName,
      semanticSpec,
      baseSpec,
      [
        ` * Effect System — semantic classes (${themeName}).`,
        ' * Source: spec/effect/semantic.json, spec/effect/base.json (shadow stacks)',
      ],
    );

    writeImportAggregator(
      join(cssDir, 'effect/themes', `${themeName}.css`),
      [`./${themeName}/base.css`, `./${themeName}/semantic.css`],
      `Effect System entry (${themeName})`,
    );
  }

  writeImportAggregator(
    join(cssDir, 'effect/index.css'),
    ['./themes/light.css', './themes/dark.css'],
    'Effect System entry (all themes)',
  );
}

function buildColorSystem() {
  const baseSpec = loadJson('color/base.json');
  const semanticSpec = loadJson('color/semantic.json');
  const semanticGroups = groupColorSemanticTokens(semanticSpec.tokens);

  for (const themeName of ['light', 'dark']) {
    const selector = themeSelector(themeName);
    const themeDir = join(cssDir, 'color/themes', themeName);

    writeColorBaseCssFile(
      join(themeDir, 'base.css'),
      selector,
      themeName,
      baseSpec,
      [
        ` * Color System — base palette (${themeName}).`,
        ' * Source: spec/color/base.json',
        ' * Figma: node 2008:41 (Primitives@Cregis)',
      ],
      COLOR_BASE_ORDER,
    );

    writeColorSemanticCssFile(join(themeDir, 'semantic.css'), selector, semanticGroups, themeName, [
      ` * Color System — semantic colors referencing base (${themeName}).`,
      ' * Source: spec/color/semantic.json',
      ' * Figma: node 2536:5814 (Variable Name column)',
    ]);

    writeImportAggregator(
      join(cssDir, 'color/themes', `${themeName}.css`),
      [`./${themeName}/base.css`, `./${themeName}/semantic.css`],
      `Color System entry (${themeName})`,
    );
  }

  writeImportAggregator(
    join(cssDir, 'color/index.css'),
    ['./themes/light.css', './themes/dark.css', './tag/index.css'],
    'Color System entry (all themes)',
  );
}

function buildTagColorSystem() {
  const tagPalette = loadJson('color/tag-palette.json');
  const tagBaseSpec = buildTagBaseSpec(tagPalette);
  const tagSemanticTokens = expandTagPaletteSemanticTokens(tagPalette);
  const semanticGroups = groupTagSemanticTokens(tagSemanticTokens);

  for (const themeName of ['light', 'dark']) {
    const selector = themeSelector(themeName);
    const themeDir = join(cssDir, 'color/tag/themes', themeName);

    writeColorBaseCssFile(join(themeDir, 'base.css'), selector, themeName, tagBaseSpec, [
      ` * Tag Color System — base palette (${themeName}).`,
      ' * Source: spec/color/tag-palette.json',
      ' * Figma: Status / Colorful / Custom tag nodes in tag-palette.json',
    ]);

    writeColorSemanticCssFile(join(themeDir, 'semantic.css'), selector, semanticGroups, themeName, [
      ` * Tag Color System — semantic colors referencing tag base (${themeName}).`,
      ' * Source: spec/color/tag-palette.json',
    ]);

    writeImportAggregator(
      join(cssDir, 'color/tag/themes', `${themeName}.css`),
      [`./${themeName}/base.css`, `./${themeName}/semantic.css`],
      `Tag Color System entry (${themeName})`,
    );
  }

  writeImportAggregator(
    join(cssDir, 'color/tag/index.css'),
    ['./themes/light.css', './themes/dark.css'],
    'Tag Color System entry (all themes)',
  );
}

function buildRootIndex() {
  writeImportAggregator(
    join(cssDir, 'index.css'),
    [
      './scale/index.css',
      './typography/index.css',
      './motion/index.css',
      './color/index.css',
      './effect/index.css',
      './liquid-glass/index.css',
    ],
    'EverGreen Design Tokens — layered CSS architecture',
  );
}

function buildJsonExport() {
  const scaleBaseSpec = loadJson('scale/base.json');
  const scaleSemanticSpec = loadJson('scale/semantic.json');
  const typographyBaseSpec = loadJson('typography/base.json');
  const typographySemanticSpec = loadJson('typography/semantic.json');
  const textStylesSpec = loadJson('text/styles.json');
  const effectBaseSpec = loadJson('effect/base.json');
  const effectSemanticSpec = loadJson('effect/semantic.json');
  const motionBaseSpec = loadJson('motion/base.json');
  const motionRecipeSpec = loadJson('motion/recipe.json');
  const motionSemanticSpec = loadJson('motion/semantic.json');
  const motionBaseFullSpec = loadJson('motion/base.json');
  const motionNamedRecipes = loadJson('motion/recipe.json').namedRecipes ?? [];

  const scaleUnit = resolveScaleBaseUnit(scaleBaseSpec);
  const scaleMultipliers = {};
  const scaleLiterals = {};
  const scaleFormulas = {};
  const scaleResolved = {};

  for (const [name, entry] of Object.entries(scaleBaseSpec.scale)) {
    if (typeof entry === 'number') {
      scaleMultipliers[name] = entry;
      scaleFormulas[name] = `calc(${entry} * var(--scale-base))`;
      scaleResolved[name] = `${entry * scaleUnit}px`;
      continue;
    }

    scaleLiterals[name] = entry;
    scaleFormulas[name] = entry;
    scaleResolved[name] = entry;
  }

  const scaleBase = {
    scaleBase: scaleUnit,
    multipliers: scaleMultipliers,
    literals: scaleLiterals,
    formulas: scaleFormulas,
    resolved: scaleResolved,
  };
  const scaleSemantic = Object.fromEntries(
    flattenScaleSemanticTokens(scaleSemanticSpec).map((token) => [token.name, token.value]),
  );

  const typographyBase = Object.fromEntries(
    typographyBaseSpec.groups.flatMap((group) => Object.entries(group.tokens)),
  );
  const typographySemantic = Object.fromEntries(
    flattenGroupedSemanticTokens(typographySemanticSpec).map((token) => [token.name, token.value]),
  );

  const payload = {
    scaleBase,
    scaleSemantic,
    scale: {
      'scale-base': `${scaleUnit}px`,
      ...scaleFormulas,
      ...scaleSemantic,
    },
    typographyBase,
    typographySemantic,
    typography: {
      ...typographyBase,
      ...typographySemantic,
    },
    textStyles: Object.fromEntries(
      textStylesSpec.styles.map((style) => [style.className, style.properties]),
    ),
    effectBase: {
      colors: effectBaseSpec.colors,
      tokens: Object.fromEntries(
        effectBaseSpec.groups.flatMap((group) =>
          group.tokens
            .filter((token) => !token.placeholder)
            .map((token) => [
              token.name,
              token.layers ? token.layers.join(', ') : token.value,
            ]),
        ),
      ),
    },
    effectSemantic: Object.fromEntries(
      effectSemanticSpec.groups.flatMap((group) =>
        group.styles.map((style) => [style.className, style.properties ?? {}]),
      ),
    ),
    motionBase: Object.fromEntries(
      motionBaseSpec.groups.flatMap((group) => {
        if (group.tokenList?.length) {
          return group.tokenList.map((token) => [token.name, token.value]);
        }
        if (group.tokens) {
          return Object.entries(group.tokens);
        }
        return [];
      }),
    ),
    motionRecipe: Object.fromEntries(
      motionRecipeSpec.groups.flatMap((group) => {
        if (group.tokenList?.length) {
          return group.tokenList.map((token) => [token.name, token.value]);
        }
        return [];
      }),
    ),
    motionSemantic: Object.fromEntries(
      motionSemanticSpec.groups.flatMap((group) =>
        (group.styles ?? []).flatMap((style) => {
          const entries = [];
          if (style.properties !== undefined) {
            entries.push([style.className, style.properties]);
          }
          for (const stateStyle of style.stateStyles ?? []) {
            entries.push([stateStyle.hostClass, stateStyle.properties ?? {}]);
          }
          if (style.activeState) {
            entries.push([`${style.className}.${style.activeModifier ?? 'is-active'}`, style.activeState]);
          }
          return entries;
        }),
      ),
    ),
    motionUtilities: Object.fromEntries(
      (motionSemanticSpec.utilityClasses ?? []).map((utility) => [
        utility.className,
        { transition: utility.standaloneTransition ?? 'none' },
      ]),
    ),
    motionSprings: motionBaseFullSpec.springs ?? {},
    motionHaptics: motionBaseFullSpec.haptics ?? {},
    motionTimings: motionBaseFullSpec.timings ?? {},
    motionNamedRecipes: Object.fromEntries(motionNamedRecipes.map((r) => [r.id, r])),
    motionCompositions: Object.fromEntries(
      (motionSemanticSpec.compositions ?? []).map((composition) => [composition.id, composition]),
    ),
    motionReducedMotion: motionSemanticSpec.reducedMotion ?? {},
    glassBoxCompositions: buildGlassBoxCompositions({
      effectSemanticSpec,
      effectBaseSpec,
      scaleSemanticSpec: loadJson('scale/semantic.json'),
      scaleBaseSpec: loadJson('scale/base.json'),
      colorBaseSpec: loadJson('color/base.json'),
      colorSemanticSpec: loadJson('color/semantic.json'),
    }),
  };

  const baseSpec = loadJson('color/base.json');
  const semanticSpec = loadJson('color/semantic.json');

  for (const themeName of ['light', 'dark']) {
    payload[`colorBase_${themeName}`] = baseSpec[themeName];
    payload[`colorSemantic_${themeName}`] = Object.fromEntries(
      semanticSpec.tokens.map((token) => [token.name, token[themeName]]),
    );
  }

  mkdirSync(join(distDir, 'json'), { recursive: true });
  writeFileSync(join(distDir, 'json/tokens.json'), JSON.stringify(payload, null, 2));
}

async function buildAll() {
  rmSync(distDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
  mkdirSync(distDir, { recursive: true });

  buildScaleSystem();
  buildTypographySystem();
  buildMotionSystem();
  buildEffectSystem();
  buildLiquidGlassCssSystem();
  buildColorSystem();
  buildTagColorSystem();
  buildRootIndex();
  buildJsonExport();
  buildRnTheme({ specDir, distDir });
  await buildCornerSmoothingAssets();

  const colorErrors = verifyColorSpecAgainstDist();
  if (colorErrors.length > 0) {
    throw new Error(`Color spec verification failed:\n${colorErrors.join('\n')}`);
  }

  console.log('✓ Tokens built with layered CSS architecture');

  const repoRoot = resolve(rootDir, '../..');
  const manifest = spawnSync('node', ['apps/showcase/scripts/extract-dist-css-manifest.mjs'], {
    cwd: repoRoot,
    stdio: 'inherit',
  });
  if (manifest.status !== 0) {
    throw new Error('Showcase dist CSS manifest extract failed after token build');
  }
}

buildAll().catch((error) => {
  console.error(error);
  process.exit(1);
});
