#!/usr/bin/env node
/**
 * Linked consumer: token spec → build:tokens → Metro reload on business app port.
 * Components/animations are read from source via packages/mobile/linkedMetroEntry.ts
 * (consumer metro.config.js) — Fast Refresh, no assemble loop here.
 */
import { cpSync, existsSync, mkdirSync, watch } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { triggerMetroReload } from './trigger-metro-reload.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const metroPort = Number(process.env.EDS_CONSUMER_METRO_PORT || 8081);
const specDir = join(repoRoot, 'packages/tokens/spec');
const buildScriptsDir = join(repoRoot, 'packages/tokens/scripts');

let debounceTimer;
let building = false;
let pending = false;

async function buildAndPush(reason) {
  if (building) {
    pending = true;
    return;
  }
  building = true;
  console.log(`[watch:linked-consumers] token rebuild (${reason})…`);

  const tokenResult = spawnSync('pnpm', ['build:tokens'], { cwd: repoRoot, stdio: 'inherit' });
  if (tokenResult.status !== 0) {
    building = false;
    console.error('[watch:linked-consumers] build:tokens failed');
    pending = false;
    return;
  }

  // 增量同步 token → packages/mobile/dist/tokens（勿 full assemble rmSync，否则 Metro 会短暂 resolve 失败 / file-map 崩溃）。
  const mobileDist = join(repoRoot, 'packages/mobile/dist');
  const tokensFrom = join(repoRoot, 'packages/tokens/dist');
  const tokensTo = join(mobileDist, 'tokens');
  if (!existsSync(join(mobileDist, 'index.js'))) {
    const assembleResult = spawnSync(
      'pnpm',
      ['--filter', '@eds-evergreen/mobile', 'build'],
      { cwd: repoRoot, stdio: 'inherit' },
    );
    building = false;
    if (assembleResult.status !== 0) {
      console.error('[watch:linked-consumers] initial @eds-evergreen/mobile assemble failed');
      pending = false;
      return;
    }
  } else {
    mkdirSync(mobileDist, { recursive: true });
    cpSync(tokensFrom, tokensTo, { recursive: true });
    building = false;
  }

  await triggerMetroReload({ port: metroPort });

  if (pending) {
    pending = false;
    schedule('queued');
  }
}

function schedule(reason) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => buildAndPush(reason), 280);
}

function watchPath(label, dir) {
  watch(dir, { recursive: true }, (_event, filename) => {
    if (!filename) return;
    if (label === 'spec' && !/\.json$/.test(filename)) return;
    if (label === 'scripts' && !/\.mjs$/.test(filename)) return;
    schedule(`${label}/${filename}`);
  });
  console.log(`[watch:linked-consumers] watching ${dir}`);
}

watchPath('spec', specDir);
watchPath('scripts', buildScriptsDir);

console.log(
  `[watch:linked-consumers] push to consumer Metro :${metroPort} (EDS_CONSUMER_METRO_PORT)`,
);
console.log(
  '[watch:linked-consumers] dist consumers (Expo Go): build:tokens → copy into packages/mobile/dist/tokens → Metro reload.',
);
console.log('[watch:linked-consumers] linkedMetroEntry consumers: components/animations HMR from source.');
