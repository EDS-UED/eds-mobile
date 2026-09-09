import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

function loadJson(specDir, relativePath) {
  return JSON.parse(readFileSync(join(specDir, relativePath), 'utf-8'));
}

function flattenScaleSemantic(semanticSpec) {
  const out = {};
  for (const group of semanticSpec.groups ?? []) {
    for (const token of group.tokens) {
      const raw = token.value;
      out[token.name] = raw.endsWith('px') ? Number.parseFloat(raw) : raw;
    }
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

function parseIosMotion(iosSpec) {
  const springs = {};
  const timings = {};
  for (const group of iosSpec.groups ?? []) {
    for (const token of group.tokenList ?? []) {
      if (token.name.includes('spring')) {
        const pairs = Object.fromEntries(
          token.value.split(',').map((part) => {
            const idx = part.indexOf(':');
            const k = part.slice(0, idx).trim();
            const vRaw = part.slice(idx + 1).trim();
            const v = Number.isNaN(Number(vRaw)) ? vRaw : Number(vRaw);
            return [k, v];
          }),
        );
        springs[token.name] = pairs;
      } else {
        const durationMatch = token.value.match(/duration:([^,]+)/);
        const easingMatch = token.value.match(/easing:(.+)$/);
        timings[token.name] = {
          duration: durationMatch ? Number(durationMatch[1]) : undefined,
          easing: easingMatch ? easingMatch[1].trim() : token.value,
        };
      }
    }
  }
  return { springs, timings };
}

export function buildRnTheme({ specDir, distDir }) {
  const colorBase = loadJson(specDir, 'color/base.json');
  const colorSemantic = loadJson(specDir, 'color/semantic.json');
  const scaleSemantic = loadJson(specDir, 'scale/semantic.json');
  const typographyBase = loadJson(specDir, 'typography/base.json');
  const typographySemantic = loadJson(specDir, 'typography/semantic.json');
  const iosMotion = loadJson(specDir, 'motion/ios-native.json');

  const colors = { light: {}, dark: {} };
  for (const theme of ['light', 'dark']) {
    for (const [name, entry] of Object.entries(colorBase[theme])) {
      colors[theme][name.replace(/^eds-/, '')] = entry.hex;
    }
    for (const token of colorSemantic.tokens) {
      colors[theme][token.name] = token[theme];
    }
  }

  const theme = {
    colors,
    spacing: flattenScaleSemantic(scaleSemantic),
    typography: {
      base: flattenTypographyBase(typographyBase),
      semantic: flattenTypographySemantic(typographySemantic),
    },
    motion: parseIosMotion(iosMotion),
  };

  const jsDir = join(distDir, 'js');
  mkdirSync(jsDir, { recursive: true });

  const jsBody = `/** Auto-generated — do not edit. Source: packages/tokens/spec */\nexport const mobileTheme = ${JSON.stringify(theme, null, 2)};\nexport default mobileTheme;\n`;
  writeFileSync(join(jsDir, 'theme.js'), jsBody);

  const dts = `/** Auto-generated — do not edit. */\nexport type MobileThemeColors = Record<string, string>;\nexport type MobileTheme = {\n  colors: { light: MobileThemeColors; dark: MobileThemeColors };\n  spacing: Record<string, number | string>;\n  typography: { base: Record<string, number | string>; semantic: Record<string, string> };\n  motion: { springs: Record<string, Record<string, number>>; timings: Record<string, { duration?: number; easing?: string }> };\n};\nexport declare const mobileTheme: MobileTheme;\nexport default mobileTheme;\n`;
  writeFileSync(join(jsDir, 'theme.d.ts'), dts);

  console.log('✓ RN theme exported to dist/js/theme.js');
}
