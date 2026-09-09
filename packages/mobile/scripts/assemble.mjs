import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const mobileRoot = resolve(__dirname, '..');
const repoRoot = resolve(mobileRoot, '..');
const distRoot = join(mobileRoot, 'dist');

const SOURCES = [
  { from: join(repoRoot, 'tokens/dist'), to: join(distRoot, 'tokens') },
  { from: join(repoRoot, 'mobile-animations/dist'), to: join(distRoot, 'animations') },
  { from: join(repoRoot, 'components/dist'), to: join(distRoot, 'components') },
];

function copyDir(from, to) {
  cpSync(from, to, { recursive: true });
}

rmSync(distRoot, { recursive: true, force: true });
mkdirSync(distRoot, { recursive: true });

for (const { from, to } of SOURCES) {
  copyDir(from, to);
}

writeFileSync(
  join(distRoot, 'index.js'),
  `export * from './components/index.js';\nexport { default as mobileTheme } from './tokens/js/theme.js';\nexport * from './animations/index.js';\n`,
);

writeFileSync(
  join(distRoot, 'index.d.ts'),
  `export * from './components/index';\nexport { default as mobileTheme } from './tokens/js/theme';\nexport * from './animations/index';\n`,
);

console.log('✓ @eds-evergreen/mobile assembled');
