#!/usr/bin/env node
/** tsc 不复制非 TS 资源 → 将 `src/**\/*.png` 同路径拷入 `dist/`（Metro 按相对路径解析 @2x/@3x）。 */
import { copyFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcRoot = join(root, 'src');
const distRoot = join(root, 'dist');

let count = 0;
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(path);
    } else if (entry.name.endsWith('.png')) {
      const target = join(distRoot, relative(srcRoot, path));
      mkdirSync(dirname(target), { recursive: true });
      copyFileSync(path, target);
      count += 1;
    }
  }
}

walk(srcRoot);
console.log(`✓ static assets: ${count} png → dist`);
