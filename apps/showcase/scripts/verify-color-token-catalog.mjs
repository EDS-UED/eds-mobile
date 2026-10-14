import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { mapSemanticCssReference } from './tokenCatalogVerifyUtils.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '../../..');
const specPath = join(repoRoot, 'packages/tokens/spec/color/semantic.json');
const cssPaths = {
  light: join(repoRoot, 'packages/tokens/dist/css/color/themes/light/semantic.css'),
  dark: join(repoRoot, 'packages/tokens/dist/css/color/themes/dark/semantic.css'),
};

function parseSemanticCss(filePath) {
  const css = readFileSync(filePath, 'utf8');
  const vars = new Map();

  for (const match of css.matchAll(/^\s*--([a-z0-9-]+):\s*(.+);$/gm)) {
    vars.set(match[1], match[2].trim());
  }

  return vars;
}

export function verifyColorTokenCatalog() {
  const semanticSpec = JSON.parse(readFileSync(specPath, 'utf8'));
  const specNames = semanticSpec.tokens.map((token) => token.name);
  const errors = [];

  for (const theme of ['light', 'dark']) {
    const cssVars = parseSemanticCss(cssPaths[theme]);
    const cssNames = [...cssVars.keys()].sort();
    const sortedSpec = [...specNames].sort();

    if (cssNames.length !== sortedSpec.length) {
      errors.push(`${theme}: CSS has ${cssNames.length} vars, spec has ${sortedSpec.length}`);
    }

    for (const name of sortedSpec) {
      if (!cssVars.has(name)) {
        errors.push(`${theme}: missing in dist CSS — ${name}`);
      }
    }

    for (const name of cssNames) {
      if (!specNames.includes(name)) {
        errors.push(`${theme}: extra in dist CSS — ${name}`);
      }
    }

    for (const token of semanticSpec.tokens) {
      const expected = mapSemanticCssReference(token[theme]);
      const actual = cssVars.get(token.name);
      if (actual !== expected) {
        errors.push(`${theme}: ${token.name} reference mismatch\n  spec→css: ${expected}\n  dist:     ${actual}`);
      }
    }
  }

  return errors;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const errors = verifyColorTokenCatalog();
  if (errors.length > 0) {
    console.error('Color token catalog verification failed:\n' + errors.join('\n'));
    process.exit(1);
  }

  console.log('✓ Color token catalog matches dist/css/color/themes/*/semantic.css');
}
