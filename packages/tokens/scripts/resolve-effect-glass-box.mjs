import { resolveSemanticColorToHex } from './color-reference.mjs';

function buildScaleResolvedPool(baseSpec) {
  const unit = baseSpec.scaleBase ?? 4;
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

function flattenScaleSemanticPool(semanticSpec, baseSpec) {
  const pool = buildScaleResolvedPool(baseSpec);

  for (const group of semanticSpec.groups ?? []) {
    for (const token of group.tokens ?? []) {
      const raw = token.value;
      const trimmed = String(raw).trim();
      const pureVar = /^var\(--([a-z0-9-]+)\)$/.exec(trimmed);
      if (pureVar) {
        const resolved = pool[pureVar[1]];
        if (typeof resolved === 'number') {
          pool[token.name] = resolved;
        }
        continue;
      }
      if (trimmed.endsWith('px')) {
        pool[token.name] = Number.parseFloat(trimmed);
      }
    }
  }

  return pool;
}

function buildThemeColors(colorBase, colorSemantic, themeName) {
  const colors = {};
  for (const [name, entry] of Object.entries(colorBase[themeName] ?? {})) {
    colors[name.replace(/^eds-/, '')] = typeof entry === 'string' ? entry : entry.hex;
  }
  for (const token of colorSemantic.tokens ?? []) {
    colors[token.name] = resolveSemanticColorToHex(token[themeName], themeName, colorBase);
  }
  return colors;
}

function resolveScaleVar(name, scalePool) {
  const value = scalePool[name];
  return typeof value === 'number' ? value : undefined;
}

function resolveColorVar(name, themeColors) {
  return themeColors[name];
}

function replaceVarsInString(input, scalePool, themeColors) {
  return String(input).replace(/var\(--([a-z0-9-]+)\)/g, (_, name) => {
    const semanticColor = themeColors[name];
    if (semanticColor && typeof semanticColor === 'string' && !semanticColor.startsWith('color(')) {
      return semanticColor;
    }
    const color = resolveColorVar(name, themeColors);
    if (color) {
      return color;
    }
    const scale = resolveScaleVar(name, scalePool);
    if (typeof scale === 'number') {
      return `${scale}px`;
    }
    return `var(--${name})`;
  });
}

function parsePx(value) {
  if (typeof value === 'number') {
    return value;
  }
  const trimmed = String(value).trim();
  if (trimmed.endsWith('px')) {
    return Number.parseFloat(trimmed);
  }
  const numeric = Number.parseFloat(trimmed);
  return Number.isFinite(numeric) ? numeric : undefined;
}

function findEffectShadowToken(effectBaseSpec, shadowVarName) {
  const tokenName = shadowVarName.replace(/^--/, '');
  for (const group of effectBaseSpec.groups ?? []) {
    for (const token of group.tokens ?? []) {
      if (token.name === tokenName && token.layers) {
        return token.layers;
      }
    }
  }
  return null;
}

function parseShadowLayer(layer, scalePool, themeColors) {
  const normalized = replaceVarsInString(layer, scalePool, themeColors).trim();
  const inset = /\binset\b/i.test(normalized);
  const withoutInset = normalized.replace(/\binset/gi, '').trim();
  const parts = withoutInset.split(/\s+/);
  if (parts.length < 4) {
    return null;
  }

  const offsetX = parsePx(parts[0]) ?? 0;
  const offsetY = parsePx(parts[1]) ?? 0;
  const blurRadius = parsePx(parts[2]) ?? 0;
  const spread = parsePx(parts[3]) ?? 0;
  const color = parts.slice(4).join(' ') || '#00000000';

  return { offsetX, offsetY, blurRadius, spread, color, inset };
}

function parseBoxShadow(value, effectBaseSpec, scalePool, themeColors) {
  const trimmed = String(value).trim();
  const shadowVar = /^var\(--([a-z0-9-]+)\)$/.exec(trimmed);
  if (shadowVar) {
    const layers = findEffectShadowToken(effectBaseSpec, shadowVar[1]);
    if (layers) {
      return layers
        .map((layer) => parseShadowLayer(layer, scalePool, themeColors))
        .filter(Boolean);
    }
  }
  const single = parseShadowLayer(trimmed, scalePool, themeColors);
  return single ? [single] : [];
}

function parseBorder(value, scalePool, themeColors) {
  const resolved = replaceVarsInString(value, scalePool, themeColors);
  const match = /^([\d.]+px)\s+solid\s+(.+)$/.exec(resolved.trim());
  if (!match) {
    return undefined;
  }
  return {
    width: parsePx(match[1]) ?? 1,
    color: match[2].trim(),
  };
}

function splitBackgroundSegments(value) {
  const input = String(value).trim();
  const segments = [];
  let index = 0;

  while (index < input.length) {
    while (input[index] === ',') {
      index += 1;
    }
    if (index >= input.length) {
      break;
    }

    if (input.startsWith('linear-gradient(', index)) {
      let depth = 0;
      let end = index;
      for (; end < input.length; end += 1) {
        const char = input[end];
        if (char === '(') {
          depth += 1;
        } else if (char === ')') {
          depth -= 1;
          if (depth === 0) {
            segments.push(input.slice(index, end + 1).trim());
            index = end + 1;
            break;
          }
        }
      }
      continue;
    }

    const nextComma = input.indexOf(',', index);
    if (nextComma === -1) {
      segments.push(input.slice(index).trim());
      break;
    }
    segments.push(input.slice(index, nextComma).trim());
    index = nextComma + 1;
  }

  return segments.filter(Boolean);
}

function parseBackgroundLayers(value, scalePool, themeColors) {
  const layers = [];

  for (const segment of splitBackgroundSegments(value)) {
    const gradientMatch = /^linear-gradient\(\s*([0-9.]+)deg\s*,\s*(.+)\)$/is.exec(segment);
    if (gradientMatch) {
      const angleDeg = Number.parseFloat(gradientMatch[1]);
      const stopsRaw = gradientMatch[2].split(',');
      const stops = stopsRaw
        .map((stop) => {
          const stopMatch = /^(.+?)\s+([0-9.]+%)\s*$/s.exec(stop.trim());
          if (!stopMatch) {
            return null;
          }
          return {
            color: replaceVarsInString(stopMatch[1], scalePool, themeColors),
            position: Number.parseFloat(stopMatch[2]) / 100,
          };
        })
        .filter(Boolean);
      layers.push({ kind: 'overlayGradient', angleDeg, stops });
      continue;
    }

    layers.push({
      kind: 'fill',
      color: replaceVarsInString(segment, scalePool, themeColors),
    });
  }

  return layers;
}

/**
 * CSS blur 半径 → expo-blur intensity。iOS 为 UIViewPropertyAnimator.fractionComplete（前段几乎无模糊），
 * Android dimezis 半径 ≈ intensity / 4；×8 使 blur(8px) ≈ 64，与 Web backdrop 观感对齐。
 */
function nativeBlurIntensityFromPx(radiusPx) {
  return Math.min(100, Math.max(20, Math.round(radiusPx * 8)));
}

function parseBackdropBlur(value, scalePool) {
  const trimmed = String(value).trim();
  const blurVar = /^var\(--eds-blur-glass\)$/.exec(trimmed);
  if (blurVar) {
    const md = scalePool['blur-md'];
    if (typeof md === 'number') {
      const radiusPx = md / 2;
      return { css: trimmed, radiusPx, nativeIntensity: nativeBlurIntensityFromPx(radiusPx) };
    }
  }

  const resolved = replaceVarsInString(trimmed, scalePool, {});
  const blurMatch = /blur\(([^)]+)\)/.exec(resolved);
  if (blurMatch) {
    const radiusPx = parsePx(blurMatch[1].replace(/calc\([^)]+\)/, (calcExpr) => {
      const inner = calcExpr.slice(5, -1).trim();
      const div = /^(.+)\s*\/\s*([0-9.]+)$/.exec(inner);
      if (div) {
        const base = parsePx(div[1].trim());
        const divisor = Number.parseFloat(div[2]);
        if (typeof base === 'number' && divisor) {
          return `${base / divisor}px`;
        }
      }
      return calcExpr;
    }));
    if (typeof radiusPx === 'number') {
      return {
        css: resolved,
        radiusPx,
        nativeIntensity: nativeBlurIntensityFromPx(radiusPx),
      };
    }
  }

  return { css: trimmed, radiusPx: 8, nativeIntensity: nativeBlurIntensityFromPx(8) };
}

function pickPrimaryOuterShadow(shadows) {
  const outer = shadows.find((shadow) => !shadow.inset);
  if (!outer) {
    return undefined;
  }
  return {
    shadowColor: outer.color,
    shadowOffset: { width: outer.offsetX, height: outer.offsetY },
    shadowOpacity: 1,
    shadowRadius: outer.blurRadius,
    elevation: Math.max(1, Math.round(outer.blurRadius / 2)),
  };
}

function buildBoxComposition(properties, effectBaseSpec, scalePool, themeColors) {
  const layers = [];
  const composition = {
    borderRadius: undefined,
    border: undefined,
    layers,
    shadows: [],
    backdropBlur: undefined,
    viewStyle: {},
  };

  if (properties['border-radius']) {
    const radius = replaceVarsInString(properties['border-radius'], scalePool, themeColors);
    composition.borderRadius = parsePx(radius);
  }

  if (properties.border) {
    composition.border = parseBorder(properties.border, scalePool, themeColors);
  }

  if (properties.background) {
    layers.push(...parseBackgroundLayers(properties.background, scalePool, themeColors));
  }

  if (properties['box-shadow']) {
    composition.shadows = parseBoxShadow(properties['box-shadow'], effectBaseSpec, scalePool, themeColors);
  }

  if (properties['backdrop-filter']) {
    composition.backdropBlur = parseBackdropBlur(properties['backdrop-filter'], scalePool);
  }

  const fill = layers.find((layer) => layer.kind === 'fill');
  const viewStyle = {};
  if (typeof composition.borderRadius === 'number') {
    viewStyle.borderRadius = composition.borderRadius;
  }
  if (composition.border) {
    viewStyle.borderWidth = composition.border.width;
    viewStyle.borderColor = composition.border.color;
  }
  if (fill?.color) {
    viewStyle.backgroundColor = fill.color;
  }
  Object.assign(viewStyle, pickPrimaryOuterShadow(composition.shadows) ?? {});
  composition.viewStyle = viewStyle;

  return composition;
}

/**
 * Resolve effect/semantic.json Glass Box classes into RN/iOS/Android compositions (per theme).
 */
export function buildGlassBoxCompositions({
  effectSemanticSpec,
  effectBaseSpec,
  scaleSemanticSpec,
  scaleBaseSpec,
  colorBaseSpec,
  colorSemanticSpec,
}) {
  const scalePool = flattenScaleSemanticPool(scaleSemanticSpec, scaleBaseSpec);
  const themes = { light: {}, dark: {} };

  for (const themeName of ['light', 'dark']) {
    const themeColors = buildThemeColors(colorBaseSpec, colorSemanticSpec, themeName);

    for (const group of effectSemanticSpec.groups ?? []) {
      for (const style of group.styles ?? []) {
        themes[themeName][style.className] = buildBoxComposition(
          style.properties ?? {},
          effectBaseSpec,
          scalePool,
          themeColors,
        );
      }
    }
  }

  const boxes = {};
  for (const group of effectSemanticSpec.groups ?? []) {
    for (const style of group.styles ?? []) {
      boxes[style.className] = {
        title: style.title,
        className: style.className,
        light: themes.light[style.className],
        dark: themes.dark[style.className],
      };
    }
  }

  return boxes;
}
