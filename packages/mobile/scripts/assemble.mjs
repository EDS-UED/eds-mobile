import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const mobileRoot = resolve(__dirname, '..');
const repoRoot = resolve(mobileRoot, '..');
const distRoot = join(mobileRoot, 'dist');
const stageRoot = join(mobileRoot, 'dist.__assemble');

const SOURCES = [
  { from: join(repoRoot, 'tokens/dist'), rel: 'tokens' },
  { from: join(repoRoot, 'animations/dist'), rel: 'animations' },
  { from: join(repoRoot, 'components/dist'), rel: 'components' },
];

function copyDir(from, to) {
  cpSync(from, to, { recursive: true });
}

function listFiles(root, base = root, out = []) {
  if (!existsSync(root)) return out;
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const abs = join(root, entry.name);
    if (entry.isDirectory()) listFiles(abs, base, out);
    else out.push(abs.slice(base.length + 1));
  }
  return out;
}

function removeEmptyDirs(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) removeEmptyDirs(join(dir, entry.name));
  }
  if (dir !== distRoot && readdirSync(dir).length === 0) rmSync(dir, { recursive: true });
}

/**
 * 逐文件同步 stage → dist：同目录临时文件 + rename 覆盖（单文件原子），新增先于删除。
 * 不可整目录 rename 换 dist — Metro 文件监听不感知父目录替换，会持续供旧代码。
 */
function syncStageToDist() {
  mkdirSync(distRoot, { recursive: true });
  const staged = listFiles(stageRoot);
  const stagedSet = new Set(staged);
  const pending = staged
    .map((rel) => ({ rel, next: readFileSync(join(stageRoot, rel)) }))
    .filter(({ rel, next }) => {
      const target = join(distRoot, rel);
      return !existsSync(target) || !readFileSync(target).equals(next);
    })
    .sort((a, b) => Number(existsSync(join(distRoot, a.rel))) - Number(existsSync(join(distRoot, b.rel))));
  for (const { rel, next } of pending) {
    const target = join(distRoot, rel);
    mkdirSync(dirname(target), { recursive: true });
    const tmp = `${target}.__assemble_tmp`;
    writeFileSync(tmp, next);
    renameSync(tmp, target);
  }
  const removed = listFiles(distRoot).filter((rel) => !stagedSet.has(rel));
  for (const rel of removed) rmSync(join(distRoot, rel), { force: true });
  removeEmptyDirs(distRoot);
  return { written: pending.length, removed: removed.length };
}

rmSync(stageRoot, { recursive: true, force: true });
rmSync(join(mobileRoot, 'dist.__prev'), { recursive: true, force: true });
mkdirSync(stageRoot, { recursive: true });

for (const { from, rel } of SOURCES) {
  copyDir(from, join(stageRoot, rel));
}

/** Android 平滑圆角原生模块 · Expo autolinking 需包根 `expo-module.config.json` + `android/`。 */
const nativeAndroidDir = join(mobileRoot, 'android');
rmSync(nativeAndroidDir, { recursive: true, force: true });
copyDir(join(repoRoot, 'components/android'), nativeAndroidDir);
cpSync(join(repoRoot, 'components/expo-module.config.json'), join(mobileRoot, 'expo-module.config.json'));

writeFileSync(
  join(stageRoot, 'index.js'),
  `export * from './components/index.js';\nexport { default as mobileTheme } from './tokens/js/theme.js';\nexport * from './animations/index.js';\n`,
);

writeFileSync(
  join(stageRoot, 'index.d.ts'),
  `export * from './components/index';\nexport { default as mobileTheme } from './tokens/js/theme';\nexport * from './animations/index';\n`,
);

const { written, removed } = syncStageToDist();
rmSync(stageRoot, { recursive: true, force: true });

console.log(`✓ @eds-evergreen/mobile assembled (${written} written · ${removed} removed)`);
