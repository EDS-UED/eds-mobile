#!/usr/bin/env node
/**
 * Discover and sync local projects that link to @eds/mobile-* from eds-mobile ONLY.
 * Never touches eds-desktop or its consumers.
 */

import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const EDS_ROOT = resolve(__dirname, '..');
const PROJECTS_ROOT = resolve(EDS_ROOT, '..');

const MOBILE_DEPS = [
  '@eds/mobile-components',
  '@eds/mobile-tokens',
  '@eds/mobile-animations',
  '@eds-evergreen/mobile',
];

function parseArgs(argv) {
  return {
    listOnly: argv.includes('--list'),
    skipBuild: argv.includes('--skip-build'),
    targets: argv.filter((a) => !a.startsWith('--')),
  };
}

function projectLinksToEdsMobile(projectDir) {
  const pkgPath = join(projectDir, 'package.json');
  if (!existsSync(pkgPath)) return false;

  let pkg;
  try {
    pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  } catch {
    return false;
  }

  const sections = [pkg.dependencies, pkg.devDependencies, pkg.peerDependencies].filter(Boolean);
  for (const section of sections) {
    for (const name of MOBILE_DEPS) {
      const value = section[name];
      if (!value || typeof value !== 'string') continue;
      if (!value.startsWith('link:') && !value.startsWith('file:')) continue;
      const pathPart = value.replace(/^(link:|file:)/, '');
      const resolved = resolve(projectDir, pathPart);
      if (resolved.startsWith(EDS_ROOT) || pathPart.includes('eds-mobile')) {
        return true;
      }
    }
  }
  return false;
}

function discoverConsumers() {
  if (!existsSync(PROJECTS_ROOT)) return [];

  const found = [];
  for (const entry of readdirSync(PROJECTS_ROOT)) {
    if (entry === 'eds-mobile' || entry === 'eds-desktop') continue;
    const projectDir = join(PROJECTS_ROOT, entry);
    try {
      if (!statSync(projectDir).isDirectory()) continue;
    } catch {
      continue;
    }
    if (projectLinksToEdsMobile(projectDir)) {
      found.push({ name: entry, path: projectDir });
    }
  }
  return found.sort((a, b) => a.name.localeCompare(b.name));
}

function run(cmd, cwd) {
  console.log(`\n→ ${cmd}`);
  execSync(cmd, { cwd, stdio: 'inherit' });
}

function main() {
  const { listOnly, skipBuild, targets } = parseArgs(process.argv.slice(2));
  let consumers = discoverConsumers();

  if (targets.length > 0) {
    consumers = consumers.filter((c) => targets.some((t) => c.name === t || c.path.endsWith(t)));
  }

  console.log('eds-mobile local consumers:');
  if (consumers.length === 0) {
    console.log('  (none found under', PROJECTS_ROOT + ')');
  } else {
    for (const c of consumers) {
      console.log(`  • ${c.name}  ${c.path}`);
    }
  }

  if (listOnly) return;

  if (!skipBuild) {
    console.log('\n=== Building eds-mobile ===');
    run('pnpm build:tokens && pnpm build:animations && pnpm build:components', EDS_ROOT);
  }

  for (const c of consumers) {
    console.log(`\n=== Syncing ${c.name} ===`);
    const viteCache = join(c.path, 'node_modules', '.vite');
    if (existsSync(viteCache)) {
      try {
        rmSync(viteCache, { recursive: true, force: true });
      } catch {
        // ignore
      }
    }
    run('pnpm install', c.path);
  }

  console.log('\n✓ Sync complete (eds-desktop untouched).');
}

main();
