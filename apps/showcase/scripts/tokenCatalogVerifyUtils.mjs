import { readFileSync } from 'node:fs';

export function cssValueLine(value) {
  const trimmed = value.trim();
  return trimmed.endsWith(';') ? trimmed : `${trimmed};`;
}

export function mapSemanticCssReference(value) {
  const match = value.match(/^color\(var\((--eds-[a-z-]+)\)\s*\/\s*([0-9.]+)\)$/);
  if (!match) {
    return value;
  }

  const [, varName, alphaRaw] = match;
  const alpha = Number(alphaRaw);

  if (alpha === 0) {
    return 'transparent';
  }

  if (alpha === 1) {
    return `var(${varName})`;
  }

  const percent = `${Math.round(alpha * 100)}%`;
  return `color-mix(in display-p3, var(${varName}) ${percent}, transparent)`;
}

export function parseCssVarsFromFile(filePath, options = {}) {
  const css = readFileSync(filePath, 'utf8');
  let body = css;

  if (options.stripThemeWrapper) {
    const themeMatch = body.match(/\[(?:data-theme="[^"]+"|:root[^\{]*)\]\s*\{([\s\S]*)\}\s*$/);
    if (themeMatch) {
      body = themeMatch[1];
    }
  }

  const vars = {};
  for (const match of body.matchAll(/^\s*(--[a-z0-9-]+):\s*([^;]+);/gm)) {
    vars[match[1].slice(2)] = match[2].trim();
  }

  return vars;
}
