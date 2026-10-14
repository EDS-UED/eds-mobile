#!/usr/bin/env node
/**
 * Showcase dev: token watch + Expo Metro (components/animations already resolve to src).
 */
import { spawn, spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

console.log('[dev-showcase] ensuring packages/dist…');
const ensure = spawnSync(
  'node',
  ['scripts/ensure-built.mjs', '@eds/mobile-tokens', '@eds/mobile-components'],
  { cwd: repoRoot, stdio: 'inherit' },
);
if (ensure.status !== 0) process.exit(ensure.status ?? 1);

console.log('[dev-showcase] syncing token CSS manifest for showcase…');
const manifest = spawnSync('node', ['apps/showcase/scripts/extract-dist-css-manifest.mjs'], {
  cwd: repoRoot,
  stdio: 'inherit',
});
if (manifest.status !== 0) process.exit(manifest.status ?? 1);

// Expo Go ships fixed native binaries; a JS/native version mismatch (e.g. Skia) hard-crashes on render.
if (process.env.EDS_SKIP_NATIVE_CHECK !== '1') {
  console.log('[dev-showcase] checking native deps against Expo SDK…');
  const check = spawnSync(
    'pnpm',
    ['--filter', '@eds/mobile-showcase', 'exec', 'expo', 'install', '--check'],
    { cwd: repoRoot, stdio: 'inherit' },
  );
  if (check.status !== 0) {
    console.error(
      '[dev-showcase] native deps out of sync with Expo SDK — Expo Go will crash on affected screens.\n' +
        '  fix:  cd apps/showcase && npx expo install --fix\n' +
        '  skip: EDS_SKIP_NATIVE_CHECK=1 pnpm dev:showcase',
    );
    process.exit(1);
  }
}

const children = [];

function start(name, command, args, cwd = repoRoot) {
  const child = spawn(command, args, {
    cwd,
    stdio: 'inherit',
    env: process.env,
  });
  child.on('exit', (code, signal) => {
    if (signal) {
      console.log(`[dev-showcase] ${name} stopped (${signal})`);
    } else if (code && code !== 0) {
      console.error(`[dev-showcase] ${name} exited with code ${code}`);
    }
    shutdown(code ?? 0);
  });
  children.push(child);
  return child;
}

function shutdown(code = 0) {
  for (const child of children) {
    if (!child.killed) child.kill('SIGTERM');
  }
  process.exit(code);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

start('watch-tokens', 'node', ['scripts/watch-tokens.mjs']);
start('watch-showcase-nav', 'node', ['scripts/watch-showcase-nav.mjs']);
start('expo', 'pnpm', ['--filter', '@eds/mobile-showcase', 'exec', 'expo', 'start', '--port', '8080'], repoRoot);

console.log('[dev-showcase] live on save:');
console.log('  · showcase src / components / animations → Fast Refresh');
console.log('  · showcase _layout / stackScreenOptions → auto reload');
console.log('  · packages/tokens/spec → rebuild + auto reload');
console.log('[dev-showcase] Metro :8080 · simulator: i / a · manual reload: r · clear cache: shift+r');
