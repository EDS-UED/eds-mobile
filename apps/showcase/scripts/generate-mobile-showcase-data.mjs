#!/usr/bin/env node
/** Generate Mobile showcase catalog + preview registry from figmaComponentCatalog */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const showcaseSrc = resolve(__dirname, '../src');
const catalogPath = join(
  resolve(__dirname, '../../../packages/components/src/catalog/figmaCatalog.ts'),
);

const raw = readFileSync(catalogPath, 'utf8');
const jsonMatch = raw.match(/figmaComponentCatalog: FigmaComponentEntry\[\] = (\[[\s\S]*?\]) as const/);
if (!jsonMatch) throw new Error('Could not parse figmaComponentCatalog');
const figmaCatalog = JSON.parse(jsonMatch[1]);

const FAMILY_META = {
  text: { name: 'Text', slug: 'text', description: 'Mobile typography roles — Display through Bar.' },
  divider: { name: 'Divider', slug: 'divider', description: 'Horizontal and vertical dividers.' },
  avatar: { name: 'Avatar', slug: 'avatar', description: 'User avatar presets.' },
  crypto: { name: 'Crypto', slug: 'crypto', description: 'Cryptocurrency asset marks.' },
  icon: { name: 'Icons', slug: 'icons', description: 'SVG icon set for Mobile applications.' },
  button: { name: 'Button', slug: 'button', description: 'Brand, Decor, Danger, Link, Option, Icon Container.' },
  input: { name: 'Input', slug: 'input', description: 'Input, Search, Textarea, Quick Input combos.' },
  dropdown: { name: 'Drop-Down', slug: 'dropdown', description: 'Dropdown trigger variants.' },
  tag: { name: 'Tag', slug: 'tag', description: 'System and Color tag variants.' },
  toggle: { name: 'Toggle', slug: 'toggle', description: 'Switch, Checkbox, Radio, Decide.' },
  tab: { name: 'Tab', slug: 'tab', description: 'Tab, Segmented Control.' },
  feedback: { name: 'Feedback', slug: 'feedback', description: 'Toast, Status Card, Form Submission.' },
  popovers: { name: 'Popovers', slug: 'popovers', description: 'Popover notes and overlays.' },
  'tab-bar': { name: 'TabBar', slug: 'tab-bar', description: 'Bottom tab bar — Cregis / UDun presets.' },
  index: { name: 'Index', slug: 'index', description: 'Showcase index chrome.' },
};

function catalogBody(id, label, pageSlug) {
  return `{ id: '${id}', label: '${label}', standalonePage: true${pageSlug ? `, pageSlug: '${pageSlug}'` : ''} }`;
}

function catalogFlatFamily(meta, description) {
  return `{
        name: '${meta.name}',
        slug: '${meta.slug}',
        description: '${description.replace(/'/g, "\\'")}',
        status: 'implemented',
      }`;
}

function catalogSceneChild(entry) {
  const figmaLabel = entry.figmaName.replace(/'/g, "\\'");
  const exportName = entry.exportName.replace(/'/g, "\\'");
  return `{ id: '${entry.slug}', label: '${figmaLabel}', exportName: '${exportName}', navParent: '${entry.family}-scenes', standalonePage: true, pageSlug: '${entry.slug}' }`;
}

function buildSection(title, tier, families) {
  const flatAtoms = new Set(['icon', 'crypto', 'avatar', 'divider']);

  const items = families
    .filter((f) => FAMILY_META[f])
    .map((family) => {
      const meta = FAMILY_META[family];
      const entries = figmaCatalog.filter((e) => e.family === family && e.tier === tier);
      if (entries.length === 0) return null;

      if (tier === 'atoms' && flatAtoms.has(family)) {
        const countHint =
          family === 'icon'
            ? `共 ${entries.length} 个图标（Mobile Figma 组件集）。`
            : family === 'crypto'
              ? `共 ${entries.length} 个资产（Mobile Figma 组件集）。`
              : meta.description;
        return catalogFlatFamily(meta, countHint);
      }

      const bodyId = `${meta.slug}-body`;
      const children = [
        catalogBody(bodyId, meta.name, bodyId),
        `{ id: '${meta.slug}-scenes', label: 'Scenes', navSection: true }`,
      ];

      for (const entry of entries) {
        children.push(catalogSceneChild(entry));
      }

      return `{
        name: '${meta.name}',
        slug: '${meta.slug}',
        description: '${meta.description}',
        status: 'implemented',
        children: [${children.join(',\n          ')}],
      }`;
    })
    .filter(Boolean);

  return `{
    title: '${title}',
    items: [${items.join(',\n      ')}],
  }`;
}

const catalogTs = `/** Auto-generated from Mobile Figma catalog — do not edit by hand */
import type { CatalogSection } from '../types';

export const componentCatalog: CatalogSection[] = [
  ${buildSection('Atoms', 'atoms', ['icon', 'crypto', 'avatar', 'divider'])},
  ${buildSection('Molecules', 'molecules', ['input', 'button', 'dropdown', 'tag', 'toggle', 'tab', 'feedback', 'popovers'])},
  ${buildSection('Organisms', 'organisms', ['tab-bar'])},
];
`;

const FLAT_FAMILY_SLUGS = new Set(['icons', 'crypto', 'avatar', 'divider']);

const FLAT_FAMILY_EXPORT = {
  icons: 'EgIcon',
  crypto: 'EgCrypto',
  avatar: 'EgAvatar',
  divider: 'EgDivider',
};

const previewEntries = new Map();
for (const entry of figmaCatalog) {
  if (entry.tier === 'atoms' && (entry.family === 'icon' || entry.family === 'crypto')) {
    continue;
  }
  previewEntries.set(entry.slug, { title: entry.figmaName, exportName: entry.exportName });
}
for (const meta of Object.values(FAMILY_META)) {
  if (FLAT_FAMILY_SLUGS.has(meta.slug)) {
    previewEntries.set(meta.slug, {
      title: meta.name,
      exportName: FLAT_FAMILY_EXPORT[meta.slug] ?? undefined,
    });
  } else {
    previewEntries.set(`${meta.slug}-body`, { title: meta.name });
  }
}

function escapeTitle(title) {
  return title.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function escapeExportName(exportName) {
  return exportName.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

const REAL_PREVIEW_SLUGS = new Set(['icons', 'crypto', 'avatar']);

const previewLines = [...previewEntries.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([slug, meta]) => {
    if (REAL_PREVIEW_SLUGS.has(slug)) {
      return `  '${slug}': REAL_PREVIEWS['${slug}'],`;
    }
    const exportArg = meta.exportName
      ? `, '${escapeExportName(meta.exportName)}'`
      : '';
    return `  '${slug}': placeholder('${slug}', '${escapeTitle(meta.title)}'${exportArg}),`;
  })
  .join('\n');

const previewIndex = `/** Auto-generated Mobile preview registry */
import type { ComponentPreviewEntry } from './componentPreviewTypes';
import ShowcasePlaceholderPreview from './ShowcasePlaceholderPreview.vue';
import IconPreview from './IconPreview.vue';
import CryptoPreview from './CryptoPreview.vue';
import AvatarPreview from './AvatarPreview.vue';

export type { ComponentPreviewEntry } from './componentPreviewTypes';

const REAL_PREVIEWS: Record<string, ComponentPreviewEntry> = {
  icons: { slug: 'icons', title: 'Icons', exportName: 'EgIcon', component: IconPreview },
  crypto: { slug: 'crypto', title: 'Crypto', exportName: 'EgCrypto', component: CryptoPreview },
  avatar: { slug: 'avatar', title: 'Avatar', exportName: 'EgAvatar', component: AvatarPreview, usesComponentDocHeader: true },
};

function placeholder(slug: string, title: string, exportName?: string): ComponentPreviewEntry {
  return { slug, title, exportName, component: ShowcasePlaceholderPreview };
}

export const componentPreviewBySlug: Record<string, ComponentPreviewEntry> = {
${previewLines}
};

export const compactComponentPreviewSlugs = new Set<string>([
  'input-body', 'button-body', 'tag-body', 'toggle-body', 'tab-body', 'dropdown-body', 'icons', 'crypto',
]);

export function usesCompactComponentPreview(slug: string) {
  return compactComponentPreviewSlugs.has(slug);
}

export function usesScrollComponentPreview(_slug: string) {
  return false;
}

export function usesTagComponentPreview(slug: string) {
  return slug.startsWith('tag-');
}

export function usesAvatarComponentPreview(slug: string) {
  return slug.startsWith('avatar-');
}
`;

const iconCount = figmaCatalog.filter((e) => e.family === 'icon').length;
const cryptoCount = figmaCatalog.filter((e) => e.family === 'crypto').length;

const statsTs = `/** Auto-generated from Mobile Figma catalog */
export const MOBILE_ICON_COUNT = ${iconCount};
export const MOBILE_CRYPTO_COUNT = ${cryptoCount};
`;

writeFileSync(join(showcaseSrc, 'data/mobileFigmaStats.ts'), statsTs);
writeFileSync(join(showcaseSrc, 'data/components/catalog.ts'), catalogTs);
writeFileSync(join(showcaseSrc, 'views/components/previews/index.ts'), previewIndex);
console.log(`✓ Generated catalog + ${previewEntries.size} preview slugs`);
