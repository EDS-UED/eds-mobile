/**
 * Tokens dist 是否已覆盖当前 spec（与 ensure-built 判定一致）。
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const tokensDir = join(repoRoot, 'packages/tokens');
const themeMarker = join(tokensDir, 'dist/js/theme.js');

function newestMtime(root, { ignore = [] } = {}) {
  if (!existsSync(root)) return 0;

  let newest = statSync(root).mtimeMs;
  const stack = [root];

  while (stack.length) {
    const current = stack.pop();
    let entries;
    try {
      entries = readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      const fullPath = join(current, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === 'dist') continue;
        if (ignore.some((part) => fullPath.includes(part))) continue;
        stack.push(fullPath);
        continue;
      }

      if (!/\.(json|md|mjs)$/.test(entry.name)) continue;
      const mtime = statSync(fullPath).mtimeMs;
      if (mtime > newest) newest = mtime;
    }
  }

  return newest;
}

export function isTokensDistFresh() {
  if (!existsSync(themeMarker)) {
    return false;
  }

  try {
    const text = readFileSync(themeMarker, 'utf8');
    if (!text.includes('"glass-button-box"') || !text.includes('"boxes"')) {
      return false;
    }
  } catch {
    return false;
  }

  const distMtime = statSync(themeMarker).mtimeMs;
  const srcMtime = Math.max(
    newestMtime(join(tokensDir, 'spec')),
    newestMtime(join(tokensDir, 'scripts')),
  );

  return distMtime >= srcMtime;
}
