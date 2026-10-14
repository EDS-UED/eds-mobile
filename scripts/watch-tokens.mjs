#!/usr/bin/env node
/**
 * Rebuild @eds/mobile-tokens when spec/ changes so Metro can hot-reload showcase.
 */
import { watch } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { triggerMetroReload } from './trigger-metro-reload.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const specDir = join(repoRoot, 'packages/tokens/spec');
const buildScriptsDir = join(repoRoot, 'packages/tokens/scripts');

let debounceTimer;
let building = false;
let pending = false;

async function buildTokens(reason) {
  if (building) {
    pending = true;
    return;
  }

  building = true;
  console.log(`[watch-tokens] rebuild (${reason})…`);

  const result = spawnSync('pnpm', ['build:tokens'], {
    cwd: repoRoot,
    stdio: 'inherit',
  });

  building = false;

  if (result.status !== 0) {
    console.error('[watch-tokens] build failed — fix spec and save again');
    pending = false;
    return;
  }

  const manifest = spawnSync('node', ['apps/showcase/scripts/extract-dist-css-manifest.mjs'], {
    cwd: repoRoot,
    stdio: 'inherit',
  });
  if (manifest.status !== 0) {
    console.error('[watch-tokens] dist CSS manifest extract failed');
    pending = false;
    return;
  }

  await triggerMetroReload();

  if (pending) {
    pending = false;
    schedule('queued change');
  }
}

function schedule(reason) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => buildTokens(reason), 280);
}

function watchPath(label, dir) {
  watch(dir, { recursive: true }, (_event, filename) => {
    if (!filename) return;
    if (!/\.(json|md|mjs)$/.test(filename)) return;
    schedule(`${label}/${filename}`);
  });
  console.log(`[watch-tokens] watching ${dir}`);
}

watchPath('spec', specDir);
watchPath('scripts', buildScriptsDir);

buildTokens('startup');
