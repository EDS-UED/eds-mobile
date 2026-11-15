import type { Href } from 'expo-router';

import { motionScenarioDemoForTokenName } from '@/data/animations/motionScenarioNav';
import {
  SHOWCASE_GLASS_EG_SLUG,
  SHOWCASE_SCROLL_EDGE_EG_SLUG,
} from '@/data/components/showcaseInfraCatalog';
import type { TokenEntry } from '@/data/tokens/tokenCatalogTypes';
import { isGlassBoxPreviewClass } from '@/views/tokens/effectTokenPreviewStyle';
import {
  isTypographyTextStyleClassName,
  textStyleRoleFromClassName,
} from '@/data/tokens/typographyTextStyleUtils';

export type TokenPreviewDestination = {
  /** 预览卡片主文案 — `效果查看 {componentLabel}` */
  componentLabel: string;
  hint?: string;
  href: Href;
};

const TEXT_ROLE_COMPONENT: Record<string, { export: string; slug: string }> = {
  display: { export: 'EgTextDisplay', slug: 'text-display' },
  headline: { export: 'EgTextHeadline', slug: 'text-headline' },
  title: { export: 'EgTextTitle', slug: 'text-title' },
  body: { export: 'EgTextBody', slug: 'text-body' },
  'body-large': { export: 'EgTextBody', slug: 'text-body' },
  'body-small': { export: 'EgTextBody', slug: 'text-body' },
  detail: { export: 'EgTextDetail', slug: 'text-detail' },
  footnote: { export: 'EgTextFootnote', slug: 'text-footnote' },
  bar: { export: 'EgTextBar', slug: 'text-bar' },
};

export function resolveTokenPreviewDestination(
  categoryId: string,
  entry: Pick<TokenEntry, 'name' | 'layer'>,
): TokenPreviewDestination | undefined {
  if (categoryId === 'effect') {
    if (entry.name === 'eds-blur-glass' || (isGlassBoxPreviewClass(entry.name) && entry.name !== 'glass-mask-box')) {
      return {
        componentLabel: 'EgGlass',
        hint: 'BlurGlass · Effect Glass Box',
        href: `/(components)/detail/${SHOWCASE_GLASS_EG_SLUG}`,
      };
    }
    if (entry.name === 'glass-mask-box') {
      return {
        componentLabel: 'EgScrollEdgeEffect',
        hint: '滚动缘 · glass-mask-box',
        href: `/(components)/detail/${SHOWCASE_SCROLL_EDGE_EG_SLUG}`,
      };
    }
    return undefined;
  }

  if (categoryId === 'motion') {
    const demo = motionScenarioDemoForTokenName(entry.name);
    if (!demo) return undefined;
    return {
      componentLabel: demo.label,
      hint: `动画场景 · ${demo.lead}`,
      href: `/(animations)/scenario/${demo.id}`,
    };
  }

  if (categoryId === 'typography' && isTypographyTextStyleClassName(entry.name)) {
    const role = textStyleRoleFromClassName(entry.name);
    const mapped = TEXT_ROLE_COMPONENT[role];
    if (mapped) {
      return {
        componentLabel: mapped.export,
        hint: `Text · ${role}`,
        href: `/(components)/detail/${mapped.slug}`,
      };
    }
  }

  return undefined;
}