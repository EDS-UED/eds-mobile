import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';

import { showcaseCardChromeStyle, showcaseTheme as theme } from '@/views/shared/showcaseTheme';

/**
 * Showcase 全局 — **区块标题 + 单张浅底圆角卡**（Tokens 列表分组 · 详情 USAGE/PROPS 同构）。
 */
export const showcaseDocSectionLayout = StyleSheet.create({
  block: {
    marginBottom: theme.layout.docSectionCardGap,
  },
  /** 与 `DocSection` 标题一致 — 左 `docSectionTitleInset` · body-small-heavy。 */
  title: {
    ...theme.font.docSectionTitle,
    paddingLeft: theme.layout.docSectionTitleInset,
    marginBottom: theme.layout.docSectionTitleCardGap,
  },
  /** 卡片外壳 — 仅圆角/裁切；叠 {@link showcaseCardChromeStyle} 铺色。 */
  cardShell: {
    marginHorizontal: theme.layout.pageInset,
    overflow: 'hidden',
    ...theme.blockRadius,
  },
  insetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.layout.tokenItemGap,
    minHeight: 52,
    paddingHorizontal: theme.layout.cardPaddingHorizontal,
    paddingVertical: theme.spacing['spacing-3'] as number,
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