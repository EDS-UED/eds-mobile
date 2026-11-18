import type { ShowcaseCatalogEntry } from '@/data/components/showcaseCatalog';
import { isShowcaseEntryImplemented } from '@/data/components/showcaseCatalog';

import { assembleComponentAnnotationDoc } from './componentAnnotationAssemble';
import { buildFamilyComponentAnnotation } from './componentAnnotationFamilies';
import { componentAnnotationBySlug } from './componentAnnotationRegistry';
import type { ShowcaseComponentAnnotationDoc } from './componentAnnotationTypes';
import { resolveSelfAnnotation, scaffoldAnnotation } from './componentAnnotationSelf';

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

/** 详情页底部「注释」— slug 覆盖 > 单组件 self > 族模板 > 脚手架兜底。 */
export function resolveShowcaseComponentAnnotation(
  entry: ShowcaseCatalogEntry | undefined,
  exportName: string,
): ShowcaseComponentAnnotationDoc {
  if (!entry) {
    return assembleComponentAnnotationDoc(scaffoldAnnotation(exportName), false);
  }

  const bySlug = componentAnnotationBySlug[entry.slug];
  if (bySlug) {
    return bySlug;
  }

  const self = resolveSelfAnnotation(entry);
  if (self) {
    const implemented = isShowcaseEntryImplemented(entry);
    return assembleComponentAnnotationDoc(self, implemented);
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