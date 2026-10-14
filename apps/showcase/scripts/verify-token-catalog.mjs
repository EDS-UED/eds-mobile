import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const showcaseDir = join(__dirname, '..');

const steps = [
  ['extract-dist-css-manifest.mjs', 'Regenerate dist CSS manifest'],
  ['verify-color-token-catalog.mjs', 'Verify color catalog'],
  ['verify-dist-token-catalog.mjs', 'Verify dist manifest coverage'],
];

for (const [script, label] of steps) {
  const result = spawnSync('node', [join(__dirname, script)], { cwd: showcaseDir, stdio: 'inherit' });
  if (result.status !== 0) {
    console.error(`✗ ${label}`);
    process.exit(result.status ?? 1);
  }
}

console.log('✓ All token catalog verifies passed');
