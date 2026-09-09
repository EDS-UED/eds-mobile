#!/usr/bin/env node
/**
 * One-time migration helpers after copying desktop showcase.
 * Rewrites desktop package refs → mobile; desktopTokens → mobileTokens.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const showcaseRoot = new URL('..', import.meta.url).pathname;
const srcRoot = join(showcaseRoot, 'src');

const REPLACEMENTS = [
  ['@eds/desktop-tokens', '@eds/mobile-tokens'],
  ['@eds/desktop-animations', '@eds/mobile-animations'],
  ['@eds/desktop-components', '@/stubs/eds-components'],
  ['@eds/desktop-showcase', '@eds/mobile-showcase'],
  ['.desktopTokens', '.mobileTokens'],
  ['desktop-token-scope.css', 'mobile-token-scope.css'],
  ['desktop-components-scope.css', 'mobile-components-scope.css'],
  ['desktop-motion-global.css', 'mobile-motion-global.css'],
  ['watch-desktop-tokens', 'watch-mobile-tokens'],
  ['scopeDesktopTokens', 'scopeMobileTokens'],
  ['@Desktop', '@Mobile'],
  ['Desktop ShowCase', 'Mobile Showcase'],
  ['EverGreen Design System (Desktop)', 'EverGreen Design System (Mobile)'],
];

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === 'stubs') continue;
      walk(full, files);
    } else {
      const ext = extname(full);
      if (['.vue', '.ts', '.css', '.json', '.html', '.mjs'].includes(ext)) {
        files.push(full);
      }
    }
  }
  return files;
}

let changed = 0;
for (const file of walk(srcRoot)) {
  if (file.includes('/previews/') && !file.endsWith('index.ts') && !file.endsWith('ShowcasePlaceholderPreview.vue') && !file.endsWith('SceneExtendingPlaceholder.vue') && !file.endsWith('componentPreviewTypes.ts')) {
    continue;
  }
  let content = readFileSync(file, 'utf8');
  let next = content;
  for (const [from, to] of REPLACEMENTS) {
    next = next.split(from).join(to);
  }
  if (next !== content) {
    writeFileSync(file, next);
    changed += 1;
  }
}

// package.json + vite.config at showcase root
for (const file of ['package.json', 'vite.config.ts', 'index.html']) {
  const full = join(showcaseRoot, file);
  let content = readFileSync(full, 'utf8');
  let next = content;
  for (const [from, to] of REPLACEMENTS) {
    next = next.split(from).join(to);
  }
  next = next.replace(/port: 5177/g, 'port: 5178');
  next = next.replace(/packages\/animations\/src/g, 'packages/mobile-animations/src');
  if (next !== content) writeFileSync(full, next);
}

console.log(`✓ Migrated ${changed} source files`);
