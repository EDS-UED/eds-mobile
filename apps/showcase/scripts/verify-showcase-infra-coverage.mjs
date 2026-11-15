#!/usr/bin/env node
/**
 * 门禁：Figma 202 之外的公共 Eg* 组件必须在 SHOWCASE_INFRA_CATALOG 中有入口，
 * 且在 rnDocBySlug + showcasePreviewRegistry 可解析。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');

/** packages/components 对外 export、但不在 Figma catalog 的 Eg* 业务组件（须同步维护）。 */
const REQUIRED_PUBLIC_EG = [
  'EgGlass',
  'EgScrollEdgeEffect',
  'EgMenu',
  'EgSheets',
  'EgSymbol',
  'EgDataList',
  'EgItem',
  'EgTabBlock',
  'EgTabBarText',
];

const infraSource = fs.readFileSync(
  path.join(repoRoot, 'apps/showcase/src/data/components/showcaseInfraCatalog.ts'),
  'utf8',
);
const infraSlugs = [...infraSource.matchAll(/slug:\s*SHOWCASE_[A-Z_]+\s*,|slug:\s*'([^']+)'/g)].map((m) => m[1]).filter(Boolean);
const infraExportNames = [...infraSource.matchAll(/exportName:\s*'([^']+)'/g)].map((m) => m[1]);

const rnDocSource = fs.readFileSync(
  path.join(repoRoot, 'apps/showcase/src/data/components/rnDocRegistry.ts'),
  'utf8',
);
const rnDocSlugs = new Set([...rnDocSource.matchAll(/^\s+'([a-z0-9-]+)':/gm)].map((m) => m[1]));

const previewSource = fs.readFileSync(
  path.join(repoRoot, 'apps/showcase/src/data/components/showcasePreviewRegistry.ts'),
  'utf8',
);
const previewExports = new Set([...previewSource.matchAll(/^\s+([A-Za-z0-9]+):\s*\(\)/gm)].map((m) => m[1]));
const catalogPreviewLoaders = fs.readFileSync(
  path.join(repoRoot, 'packages/components/src/preview/previewComponentLoaders.generated.ts'),
  'utf8',
);
const catalogPreviewExports = new Set(
  [...catalogPreviewLoaders.matchAll(/^\s+([A-Za-z0-9]+):\s*\(\)/gm)].map((m) => m[1]),
);

const figmaCatalog = fs.readFileSync(
  path.join(repoRoot, 'packages/components/src/catalog/figmaCatalog.ts'),
  'utf8',
);
const figmaExports = new Set([...figmaCatalog.matchAll(/exportName:\s*'([^']+)'/g)].map((m) => m[1]));

const problems = [];

for (const name of REQUIRED_PUBLIC_EG) {
  if (figmaExports.has(name)) {
    continue;
  }
  const covered =
    infraExportNames.includes(name) ||
    infraExportNames.includes(`Showcase${name}Preview`) ||
    infraSource.includes(`figmaName: '${name}'`);
  if (!covered) {
    problems.push(`missing SHOWCASE_INFRA_CATALOG entry: ${name}`);
    continue;
  }
}

for (const match of infraSource.matchAll(
  /figmaName:\s*'([^']+)'[\s\S]*?exportName:\s*'([^']+)'[\s\S]*?slug:\s*(?:SHOWCASE_[A-Z_]+|'([^']+)')/g,
)) {
  const exportName = match[2];
  const slugFromLiteral = match[3];
  let slug = slugFromLiteral;
  if (!slug) {
    const slugConst = /slug:\s*(SHOWCASE_[A-Z_]+)/.exec(match[0])?.[1];
    if (slugConst) {
      const constMatch = infraSource.match(new RegExp(`export const ${slugConst} = '([^']+)'`));
      slug = constMatch?.[1];
    }
  }
  if (!slug) {
    problems.push(`could not resolve slug for infra export ${exportName}`);
    continue;
  }
  if (!rnDocSlugs.has(slug)) {
    problems.push(`rnDocBySlug missing: ${slug} (${exportName})`);
  }
  const hasPreview =
    previewExports.has(exportName) || catalogPreviewExports.has(exportName);
  if (!hasPreview) {
    problems.push(`no preview loader (showcase or catalog): ${exportName}`);
  }
}

if (problems.length > 0) {
  console.error('Showcase infra coverage failed:\n' + problems.map((p) => `  · ${p}`).join('\n'));
  process.exit(1);
}

console.log(
  `verify-showcase-infra-coverage OK — ${REQUIRED_PUBLIC_EG.length} public Eg* · ${infraSlugs.length} infra slugs checked`,
);