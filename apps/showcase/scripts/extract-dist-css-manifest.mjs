import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '../../..');
const tokensDist = join(repoRoot, 'packages/tokens/dist/css');
const outputPath = join(__dirname, '../src/data/tokens/generated/distCssManifest.json');
const effectSemanticCatalogPath = join(__dirname, '../src/data/tokens/generated/effectSemanticCatalog.json');
const effectSemanticSpecPath = join(repoRoot, 'packages/tokens/spec/effect/semantic.json');

const MANIFEST_CSS_INPUTS = [
  'scale/base.css',
  'scale/semantic.css',
  'typography/base.css',
  'typography/semantic.css',
  'text/styles.css',
  'effect/themes/light/base.css',
  'effect/themes/light/semantic.css',
  'motion/base.css',
  'motion/recipe.css',
  'motion/semantic.css',
  'motion/utilities.css',
];

function newestCssInputMtime() {
  let newest = 0;
  for (const relative of MANIFEST_CSS_INPUTS) {
    const abs = join(tokensDist, relative);
    if (!existsSync(abs)) continue;
    newest = Math.max(newest, statSync(abs).mtimeMs);
  }
  return newest;
}

function newestCatalogInputMtime() {
  let newest = newestCssInputMtime();
  if (existsSync(effectSemanticSpecPath)) {
    newest = Math.max(newest, statSync(effectSemanticSpecPath).mtimeMs);
  }
  return newest;
}

function isManifestOutputFresh() {
  if (!existsSync(outputPath) || !existsSync(effectSemanticCatalogPath)) return false;
  const inputMtime = newestCatalogInputMtime();
  const outMtime = Math.min(statSync(outputPath).mtimeMs, statSync(effectSemanticCatalogPath).mtimeMs);
  return inputMtime > 0 && outMtime >= inputMtime;
}

function writeEffectSemanticCatalog() {
  const spec = JSON.parse(readFileSync(effectSemanticSpecPath, 'utf8'));
  const payload = {
    groups: (spec.groups ?? []).map((group) => ({
      comment: group.comment ?? '',
      tokens: (group.styles ?? []).map((style) => ({
        name: style.className,
        title: style.title ?? style.className,
      })),
    })),
  };
  writeFileSync(effectSemanticCatalogPath, `${JSON.stringify(payload, null, 2)}\n`);
}

function cssValueLine(value) {
  const trimmed = value.trim();
  return trimmed.endsWith(';') ? trimmed : `${trimmed};`;
}

function parseCssVars(css, options = {}) {
  const { stripThemeWrapper = false } = options;
  let body = css;

  if (stripThemeWrapper) {
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

function parseRuleBodyLines(body) {
  const withoutComments = body.replace(/\/\*[\s\S]*?\*\//g, '');
  const rawLines = withoutComments
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const lines = [];
  let index = 0;

  while (index < rawLines.length) {
    const line = rawLines[index];
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) {
      index += 1;
      continue;
    }

    const property = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    while (!value.includes(';') && index + 1 < rawLines.length) {
      index += 1;
      value += ` ${rawLines[index].trim()}`;
    }

    value = value.replace(/;\s*$/, '').trim();
    if (property && value) {
      lines.push(cssValueLine(`${property}: ${value}`));
    }

    index += 1;
  }

  return lines;
}

function parseCssRules(css) {
  const rules = [];
  const cleaned = css.replace(/\/\*[\s\S]*?\*\//g, '');

  for (const match of cleaned.matchAll(/([^{]+)\{([^}]*)\}/g)) {
    const selector = match[1].trim().replace(/\s+/g, ' ');
    const lines = parseRuleBodyLines(match[2]);

    if (lines.length === 0) {
      continue;
    }

    rules.push({ selector, lines });
  }

  return rules;
}

function primaryCatalogClass(selector) {
  const patterns = [
    /(\.glass-[a-z0-9-]+-box)/,
    /(\.motion-[a-z0-9-]+)/,
    /(\.effect-[a-z0-9-]+)/,
    /(\.typography-[a-z0-9-]+)/,
  ];

  for (const pattern of patterns) {
    const match = selector.match(pattern);
    if (match) {
      return match[1].slice(1);
    }
  }

  const fallback = selector.match(/\.([a-z0-9-]+)/);
  return fallback?.[1];
}

function parseClassSourceRefs(css, file) {
  const refs = {};
  const lines = css.split('\n');

  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(/^\.([a-z0-9-]+)\s*\{/);
    if (!match) {
      continue;
    }

    const className = match[1];
    const startLine = index + 1;
    let endLine = startLine;

    for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
      if (lines[cursor].includes('}')) {
        endLine = cursor + 1;
        break;
      }
    }

    const bodyLines = [];
    for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
      const bodyLine = lines[cursor].trim();
      if (bodyLine === '}' || bodyLine.endsWith('}')) {
        endLine = cursor + 1;
        break;
      }
      if (bodyLine) {
        bodyLines.push(bodyLine);
      }
    }

    refs[className] = {
      file,
      startLine,
      endLine,
      snippet: [`.${className}`, ...bodyLines].join('\n'),
    };
  }

  return refs;
}

function parseVarSourceRefs(css, file) {
  const refs = {};
  const lines = css.split('\n');

  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(/^\s*(--[a-z0-9-]+)\s*:/);
    if (!match) {
      continue;
    }

    const varName = match[1].slice(2);
    refs[varName] = {
      file,
      startLine: index + 1,
      endLine: index + 1,
      snippet: lines[index].trimEnd(),
    };
  }

  return refs;
}

function mergeSourceRefs(...refMaps) {
  return Object.assign({}, ...refMaps);
}

function groupRulesByPrimaryClass(rules) {
  const grouped = {};

  for (const rule of rules) {
    const className = primaryCatalogClass(rule.selector);
    if (!className) {
      continue;
    }

    grouped[className] ??= [];
    grouped[className].push(rule);
  }

  return grouped;
}

function readCss(relativePath) {
  return readFileSync(join(tokensDist, relativePath), 'utf8');
}

export function buildDistCssManifest() {
  const scaleBase = readCss('scale/base.css');
  const scaleSemantic = readCss('scale/semantic.css');
  const typographyBase = readCss('typography/base.css');
  const typographySemantic = readCss('typography/semantic.css');
  const textStyles = readCss('text/styles.css');
  const effectBaseLight = readCss('effect/themes/light/base.css');
  const effectSemanticLight = readCss('effect/themes/light/semantic.css');
  const motionBase = readCss('motion/base.css');
  const motionRecipe = readCss('motion/recipe.css');
  const motionSemantic = readCss('motion/semantic.css');
  const motionUtilities = readCss('motion/utilities.css');

  const scaleVars = { ...parseCssVars(scaleBase), ...parseCssVars(scaleSemantic) };
  const typographyVars = { ...parseCssVars(typographyBase), ...parseCssVars(typographySemantic) };
  const effectVars = {
    ...parseCssVars(effectBaseLight, { stripThemeWrapper: true }),
  };
  const motionVars = {
    ...parseCssVars(motionBase),
    ...parseCssVars(motionRecipe),
  };

  return {
    vars: {
      scale: scaleVars,
      typography: typographyVars,
      effect: effectVars,
      motion: motionVars,
    },
    sourceRefs: {
      scale: mergeSourceRefs(
        parseVarSourceRefs(scaleBase, 'base.css'),
        parseVarSourceRefs(scaleSemantic, 'semantic.css'),
      ),
      typography: mergeSourceRefs(
        parseVarSourceRefs(typographyBase, 'base.css'),
        parseVarSourceRefs(typographySemantic, 'semantic.css'),
        parseClassSourceRefs(typographySemantic, 'semantic.css'),
      ),
      effect: mergeSourceRefs(
        parseVarSourceRefs(effectBaseLight, 'base.css'),
        parseVarSourceRefs(effectSemanticLight, 'semantic.css'),
        parseClassSourceRefs(effectSemanticLight, 'semantic.css'),
      ),
      motion: mergeSourceRefs(
        parseVarSourceRefs(motionBase, 'base.css'),
        parseVarSourceRefs(motionRecipe, 'recipe.css'),
        parseVarSourceRefs(motionSemantic, 'semantic.css'),
        parseClassSourceRefs(motionSemantic, 'semantic.css'),
        parseClassSourceRefs(motionUtilities, 'utilities.css'),
      ),
    },
    classes: {
      typography: groupRulesByPrimaryClass(parseCssRules(textStyles)),
      effect: groupRulesByPrimaryClass(parseCssRules(effectSemanticLight)),
      motion: {
        ...groupRulesByPrimaryClass(parseCssRules(motionSemantic)),
        ...groupRulesByPrimaryClass(parseCssRules(motionUtilities)),
      },
    },
  };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const force = process.argv.includes('--force');
  if (!force && isManifestOutputFresh()) {
    console.log(`✓ dist CSS manifest up to date → ${outputPath}`);
    process.exit(0);
  }

  const manifest = buildDistCssManifest();
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`);
  writeEffectSemanticCatalog();
  console.log(`✓ dist CSS manifest → ${outputPath}`);
  console.log(`✓ effect semantic catalog → ${effectSemanticCatalogPath}`);
}
