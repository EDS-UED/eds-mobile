#!/usr/bin/env node
/**
 * EAS Build · pnpm monorepo — 依赖装完后构建 tokens + showcase CSS manifest。
 * 挂到 `apps/showcase/package.json` → `eas-build-post-install`。
 */
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function run(command, args) {
  const result = spawnSync(command, args, { cwd: repoRoot, stdio: 'inherit' });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run('pnpm', ['build:tokens']);
run('node', ['apps/showcase/scripts/extract-dist-css-manifest.mjs']);