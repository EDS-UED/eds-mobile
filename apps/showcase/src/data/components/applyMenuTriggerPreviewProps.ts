import { createElement } from 'react';
import type { FigmaComponentEntry } from '@eds/mobile-components/catalog';

import { ShowcaseMenuSlotTrigger } from '@/views/components/menu/ShowcaseMenuSlotTrigger';
import {
  buildMenuSectionsFromCustomize,
  resolveMenuDefaultSelectedId,
  stripMenuCustomizeMeta,
} from './menuCustomizeModel.js';

const MENU_PREVIEW_SLUGS = new Set(['menu-body', 'dropdown-body', 'dropdown-trigger']);

function isMenuPreviewEntry(
  entry: Pick<FigmaComponentEntry, 'slug' | 'family' | 'exportName'>,
): boolean {
  return (
    entry.family === 'menu' ||
    entry.family === 'dropdown' ||
    entry.exportName === 'EgMenu' ||
    entry.exportName === 'EgMenuTrigger' ||
    MENU_PREVIEW_SLUGS.has(entry.slug)
  );
}

function coerceMenuLayoutProps(base: Record<string, unknown>): Record<string, unknown> {
  const menuWidth = Number(base.menuWidth);
  const menuMaxHeight = Number(base.menuMaxHeight);
  return {
    ...base,
    ...(Number.isFinite(menuWidth) && menuWidth > 0 ? { menuWidth } : {}),
    ...(Number.isFinite(menuMaxHeight) && menuMaxHeight > 0 ? { menuMaxHeight } : {}),
  };
}

/** Menu 预览 — 触发器 + 定制态 sections。 */
export function applyMenuTriggerPreviewProps(
  entry: Pick<FigmaComponentEntry, 'slug' | 'family' | 'exportName'>,
  props: Record<string, unknown>,
): Record<string, unknown> {
  if (!isMenuPreviewEntry(entry)) {
    return props;
  }

  const { triggerVariant = 'capsule', triggerSlotLabel = '自定义触发器', ...rest } = props;
  const sections = buildMenuSectionsFromCustomize(props);
  const defaultSelectedId = resolveMenuDefaultSelectedId(props, sections);
  const base = stripMenuCustomizeMeta(rest);

  const withSections = coerceMenuLayoutProps({
    ...base,
    sections,
    defaultSelectedId,
  });

  if (triggerVariant === 'slot') {
    const label = typeof triggerSlotLabel === 'string' ? triggerSlotLabel : '自定义触发器';
    return {
      ...withSections,
      trigger: (ctx: { open: () => void; disabled: boolean }) =>
        createElement(ShowcaseMenuSlotTrigger, { ...ctx, label }),
    };
  }

  return {
    ...withSections,
    trigger: undefined,
  };
}
