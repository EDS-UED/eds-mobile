import type { ShowcaseCatalogEntry } from '@/data/components/showcaseCatalog';
import { isShowcaseEntryImplemented } from '@/data/components/showcaseCatalog';

import { buildFamilyComponentAnnotation } from './componentAnnotationFamilies';
import { componentAnnotationBySlug } from './componentAnnotationRegistry';
import type { ShowcaseComponentAnnotationDoc } from './componentAnnotationTypes';

function resolveFamily(entry: ShowcaseCatalogEntry): string {
  if ('family' in entry && typeof entry.family === 'string') {
    return entry.family;
  }
  const slug = entry.slug;
  if (slug.startsWith('page-shot')) return 'page-shot';
  if (slug.startsWith('page-')) return 'page';
  if (slug.includes('tab-bar')) return 'tab-bar';
  if (slug.includes('glass')) return 'glass';
  if (slug.includes('nav-bar')) return 'nav-bar';
  const base = slug.replace(/-alt$/, '').split('-')[0];
  return base;
}

function fallbackAnnotation(exportName: string): ShowcaseComponentAnnotationDoc {
  return {
    sections: [
      {
        title: '样式',
        lines: [
          `\`${exportName}\` 字号走 typography semantic`,
          '颜色 `text-base-*` / `material-*`',
        ],
      },
      {
        title: '布局',
        lines: [
          '间距 `spacing-*`',
          '圆角 `radius-*` + smoothRadius',
        ],
      },
      {
        title: '多系统差异',
        lines: [
          '默认 RN 单路径',
          '仅声明场景启用 iOS 26+ 原生增强',
        ],
      },
      {
        title: '其他',
        lines: ['可在 `componentAnnotationRegistry` 补 slug 细化'],
      },
    ],
  };
}

/** 详情页底部「注释」文案 — slug 覆盖 > 族模板 > 兜底。 */
export function resolveShowcaseComponentAnnotation(
  entry: ShowcaseCatalogEntry | undefined,
  exportName: string,
): ShowcaseComponentAnnotationDoc {
  if (!entry) {
    return fallbackAnnotation(exportName);
  }

  const bySlug = componentAnnotationBySlug[entry.slug];
  if (bySlug) {
    return bySlug;
  }

  const family = resolveFamily(entry);
  const doc = buildFamilyComponentAnnotation(family, entry);

  if (!isShowcaseEntryImplemented(entry)) {
    return {
      sections: doc.sections.map((section) =>
        section.title === '其他'
          ? {
              ...section,
              lines: [
                'Figma 对齐脚手架（generator）',
                '真实现后以 packages/components token 为准',
                ...section.lines,
              ],
            }
          : section,
      ),
    };
  }

  return doc;
}