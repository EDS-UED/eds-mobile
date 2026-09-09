#!/usr/bin/env node
/** Figma → Repo token sync helper for EverGreen Design System (Mobile) */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '../../..');
const figmaConfigPath = join(repoRoot, 'figma.config.json');
const specPath = join(repoRoot, 'packages/tokens/spec');

console.log('EverGreen Design System (Mobile) — Figma Token Sync\n');

const config = JSON.parse(readFileSync(figmaConfigPath, 'utf-8'));
console.log(`  Name: ${config.fileName}`);
console.log(`  Key:  ${config.fileKey}`);
console.log(`  URL:  ${config.fileUrl}\n`);
console.log('Workflow:');
console.log('  1. Export variables from Mobile Figma (Dev Mode)');
console.log('  2. node packages/tokens/scripts/import-mobile-figma.mjs');
console.log('  3. pnpm build:tokens');
console.log(`\nSpec: ${specPath}`);
console.log('\n✓ Sync helper complete. Independent from eds-desktop.');
