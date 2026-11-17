#!/usr/bin/env node
/**
 * EAS Build · 在 Install dependencies 之前执行（cwd = apps/showcase）。
 * 将 monorepo 锁文件复制到 app 目录，避免 EAS 误用 yarn / 找不到 pnpm-lock。
 */
import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const appDir = process.cwd();
const repoRoot = resolve(appDir, '../..');

// 切勿复制 pnpm-workspace.yaml：落在 apps/showcase 会让 EAS 误判 workspace 根目录。
for (const file of ['pnpm-lock.yaml', '.npmrc']) {
  const src = resolve(repoRoot, file);
  const dest = resolve(appDir, file);
  if (existsSync(src)) {
    copyFileSync(src, dest);
  }
}