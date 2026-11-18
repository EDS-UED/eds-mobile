import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';

import {
  EG_ITEM_MIN_HEIGHT,
  EG_ITEM_PAD_H,
  EG_ITEM_PAD_V,
  EG_PAGE_CONTENT_PADDING_HORIZONTAL,
} from '@eds/mobile-components';

import { showcaseCardChromeStyle, showcaseTheme as theme } from '@/views/shared/showcaseTheme';

/** 区块标题左缘距屏幕 · `docSectionTitleInset`；内容已在 `EgPage` 水平 padding 内。 */
export const docSectionTitlePaddingLeft =
  theme.layout.docSectionTitleInset - (EG_PAGE_CONTENT_PADDING_HORIZONTAL as number);

/** Tab / Tier 大标题与副文案 — 距屏幕左缘 28px（在 EgPage 水平 padding 内补差）。 */
export const SHOWCASE_PAGE_HEADING_INSET_FROM_SCREEN = 28;
export const showcasePageHeadingInsetLeft =
  SHOWCASE_PAGE_HEADING_INSET_FROM_SCREEN - (EG_PAGE_CONTENT_PADDING_HORIZONTAL as number);

/**
 * Showcase 全局 — **区块标题 + 单张浅底圆角卡**（Tokens 列表分组 · 详情 USAGE/PROPS 同构）。
 */
export const showcaseDocSectionLayout = StyleSheet.create({
  /** 区块间距由 `ShowcasePageScroll` `docSectionStack` 的 `gap` 承担，勿叠 `marginBottom`。 */
  block: {},
  /** 与 `DocSection` 标题一致 — 左 `docSectionTitleInset` · body-small-heavy。 */
  title: {
    ...theme.font.docSectionTitle,
    paddingLeft: docSectionTitlePaddingLeft,
    marginBottom: theme.layout.docSectionTitleCardGap,
  },
  /** 卡片外壳 — 水平边距由 `EgPage` / `ShowcasePageScroll` 承担。 */
  cardShell: {
    overflow: 'hidden',
    ...theme.blockRadius,
  },
  /** 族页 inset 空态 — 与定制 `EgItem` / `ShowcaseCardRow` inset 同 metrics。 */
  insetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.layout.tokenItemGap,
    minHeight: EG_ITEM_MIN_HEIGHT,
    paddingHorizontal: EG_ITEM_PAD_H,
    paddingVertical: EG_ITEM_PAD_V,
  },
  insetRowCopy: {
    flex: 1,
    gap: theme.layout.titleHintGap,
  },
  insetDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  insetStack: {
    width: '100%',
  },
  /** 令牌列表行主标题 — semibold · 与组件列表主文案同档。 */
  tokenRowTitle: {
    ...theme.font.rowTitle,
  },
  tokenRowValue: {
    ...theme.font.tokenReference,
  },
});

export function showcaseDocSectionTitleColor(colors: ShowcaseColorMap): string {
  return colors['text-base-secondary'] as string;
}

export function showcaseDocSectionCardStyle(colors: ShowcaseColorMap): ViewStyle[] {
  return [showcaseDocSectionLayout.cardShell, showcaseCardChromeStyle(colors)];
}

export function showcaseDocSectionTitleStyle(colors: ShowcaseColorMap): TextStyle[] {
  return [
    showcaseDocSectionLayout.title,
    { color: showcaseDocSectionTitleColor(colors) },
  ];
}

/** Tab 索引等 — 卡片与卡片 · `cardGap`（spacing-4 · 16px）。 */
export const showcaseIndexCardListGapStyle: ViewStyle = {
  gap: theme.layout.cardGap,
};

/** 带区块标题的多组（`ShowcaseSectionCard` / `DocSection`）— `docSectionCardGap`（spacing-6 · 24px）。 */
export const showcaseDocPageSectionsContainerStyle: ViewStyle = {
  gap: theme.layout.docSectionCardGap,
};