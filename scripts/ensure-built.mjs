#!/usr/bin/env node
/**
 * Skip package builds when dist/ is newer than src/ (dev startup fast path).
 *
 * Usage: node scripts/ensure-built.mjs @eds/mobile-components [@eds/mobile-tokens ...]
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');

const PACKAGE_DIRS = {
  '@eds/mobile-tokens': join(repoRoot, 'packages/tokens'),
  '@eds/mobile-animations': join(repoRoot, 'packages/animations'),
  '@eds/mobile-components': join(repoRoot, 'packages/components'),
};

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

      if (!/\.(ts|tsx|js|mjs|json|css)$/.test(entry.name)) continue;
      if (entry.name.endsWith('.generated.ts')) continue;
      if (fullPath.includes('/iconAssets/chunk-') || fullPath.includes('/cryptoAssets/chunk-')) {
        continue;
      }

      const mtime = statSync(fullPath).mtimeMs;
      if (mtime > newest) newest = mtime;
    }
  }

  return newest;
}

function distMarker(packageDir, packageName) {
  if (packageName === '@eds/mobile-tokens') {
    return join(packageDir, 'dist/js/theme.js');
  }
  return join(packageDir, 'dist/index.js');
}

function tokensThemeHasGlassBoxes(themePath) {
  try {
    const text = readFileSync(themePath, 'utf8');
    return text.includes('"glass-button-box"') && text.includes('"boxes"');
  } catch {
    return false;
  }
}

function isFresh(packageName) {
  const packageDir = PACKAGE_DIRS[packageName];
  if (!packageDir) {
    console.error(`[ensure-built] Unknown package: ${packageName}`);
    process.exit(1);
  }

  const marker = distMarker(packageDir, packageName);
  if (!existsSync(marker)) return false;

  if (packageName === '@eds/mobile-tokens' && !tokensThemeHasGlassBoxes(marker)) {
    return false;
  }

  const distMtime = statSync(marker).mtimeMs;
  let srcMtime = 0;
  if (packageName === '@eds/mobile-tokens') {
    srcMtime = Math.max(
      newestMtime(join(packageDir, 'spec')),
      newestMtime(join(packageDir, 'scripts')),
    );
  } else {
    srcMtime = newestMtime(join(packageDir, 'src'), {
      ignore: ['packages/components/src/atoms/_assets'],
    });
  }

  return distMtime >= srcMtime;
}

function buildPackage(packageName) {
  console.log(`[ensure-built] building ${packageName}…`);
  const result = spawnSync('pnpm', ['--filter', packageName, 'build'], {
    cwd: repoRoot,
    stdio: 'inherit',
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const requested = process.argv.slice(2);
const packages =
  requested.length > 0
    ? requested
    : Object.keys(PACKAGE_DIRS);

for (const packageName of packages) {
  if (isFresh(packageName)) {
    console.log(`[ensure-built] skip ${packageName} (dist up to date)`);
    continue;
  }
  buildPackage(packageName);
}
