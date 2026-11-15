import type { ViewStyle } from 'react-native';
import mobileTheme from '@eds/mobile-tokens/theme';

import type { ShowcaseColorMap } from '@/theme/showcaseThemeTypes';

import { showcasePreviewLayout } from '@/theme/previewLayout';
import {
  edsListRowTitleStyle,
  edsRadius,
  edsSmoothRadius,
  edsSpacing,
  edsTokenFont,
} from '@/views/shared/resolveEdsTheme';

/** Static showcase tokens — spacing / radius / typography. Colors: `useShowcaseColors()`. */
export const showcaseTheme = {
  spacing: mobileTheme.spacing,
  layout: {
    /** Page scroll / list horizontal inset — var(--spacing-5). */
    pageInset: edsSpacing('spacing-5'),
    /** Card interior — var(--spacing-5) × var(--spacing-4). */
    cardPaddingHorizontal: edsSpacing('spacing-5'),
    cardPaddingVertical: edsSpacing('spacing-4'),
    /** Gap between cards / sections — var(--spacing-4). */
    cardGap: edsSpacing('spacing-4'),
    /** 详情区块标题距屏幕左缘 · spacing-10（40px）。 */
    docSectionTitleInset: edsSpacing('spacing-10'),
    /** 区块标题 → 下方卡片 · spacing-2（8px）。 */
    docSectionTitleCardGap: edsSpacing('spacing-2'),
    /** 详情内容卡片之间 · spacing-6（24px）。 */
    docSectionCardGap: edsSpacing('spacing-6'),
    scrollBottom: edsSpacing('spacing-6'),
    /** Tab home — nav / large title → content · spacing-0. */
    navContentGapHome: edsSpacing('spacing-0'),
    /** Inner stack screens — nav → content · spacing-3 (12px). */
    navContentGapInner: edsSpacing('spacing-3'),
    /** Large title → page subtitle — spacing-05 (2px). */
    pageSubtitleGap: edsSpacing('spacing-05'),
    titleHintGap: edsSpacing('spacing-05'),
    /** Token color list — item row gap · spacing-4 (16px). */
    tokenItemGap: edsSpacing('spacing-4'),
    /** Semantic color rows — spacing-3 (12px). */
    tokenSemanticRowGap: edsSpacing('spacing-3'),
    /** Base color tile — vertical padding · spacing-8. */
    tokenBaseTilePaddingVertical: edsSpacing('spacing-8'),
    /** Base color tile — horizontal padding · spacing-8. */
    tokenBaseTilePaddingHorizontal: edsSpacing('spacing-8'),
    /** Token color list — section / group block gap · spacing-12 (48px). */
    tokenBlockGap: edsSpacing('spacing-12'),
    /** Color detail — swatch → main text · spacing-8 (32px). */
    tokenDetailSwatchTitleGap: edsSpacing('spacing-8'),
    /** Color detail — main → subtext block · spacing-4 (16px). */
    tokenDetailTitleSubtextGap: edsSpacing('spacing-4'),
    /** Color detail — subtext rows · spacing-2 (8px). */
    tokenDetailSubtextRowGap: edsSpacing('spacing-2'),
  },
  radius: {
    sm: edsRadius('radius-sm'),
    md: edsRadius('radius-md'),
    lg: edsRadius('radius-lg'),
    xl: edsRadius('radius-xl'),
    full: edsRadius('radius-full'),
  },
  /** Non-capsule radii — var(--radius-*) + borderCurve continuous (--corner-smoothing). */
  smoothRadius: {
    sm: edsSmoothRadius('radius-sm'),
    md: edsSmoothRadius('radius-md'),
    lg: edsSmoothRadius('radius-lg'),
    xl: edsSmoothRadius('radius-xl'),
  },
  /** Showcase 页面卡片 — var(--radius-lg) + continuous corner（分组列表 / 浅底块）。 */
  blockRadius: edsSmoothRadius('radius-lg'),
  /** Component Live Preview canvas — showcase app only. */
  preview: showcasePreviewLayout,
  font: {
    heroTitle: edsTokenFont('title', '700'),
    heroLead: edsTokenFont('footnote', '400'),
    sectionLabel: {
      ...edsTokenFont('footnote-strong', '600'),
      letterSpacing: 0.4,
      textTransform: 'uppercase' as const,
    },
    /** Token tab card titles (Color, Scale…) — 17px / semibold. */
    rowTitle: edsListRowTitleStyle(),
    rowHint: edsTokenFont('body-small', '400'),
    /** Token variable name — body-medium · EDSText-Regular. */
    tokenName: edsTokenFont('body-medium', '400'),
    /** Token CSS reference / value — bar (10px) · IBMPlexMono-Medium. */
    tokenReference: edsTokenFont('bar', '500', 'mono'),
    /** Token page block title — Base / Semantic · typography-display. */
    tokenBlockTitle: edsTokenFont('display', '700'),
    /** Token semantic group label · footnote (13px). */
    tokenGroupTitle: {
      ...edsTokenFont('footnote-strong', '600'),
      letterSpacing: 0.4,
      textTransform: 'uppercase' as const,
    },
    /** 组件详情 — 区块标题（预览 / 定制 / 插槽）· body-small-heavy。 */
    docSectionTitle: edsTokenFont('body-small-heavy', '600'),
    /** 定制 — 类标题（图形 / 文本）· body-medium-heavy。 */
    customizeCategoryTitle: edsTokenFont('body-medium-heavy', '600'),
    /** 定制 — 插槽小类标题 · typography-body-large-heavy。 */
    customizeSlotCategoryTitle: edsTokenFont('body-large-heavy', '700'),
    /** 定制 — 项标题 · body-medium。 */
    customizeFieldTitle: edsTokenFont('body-medium', '400'),
    /** 定制 — 选择卡默认文案 · body-small · 60%。 */
    customizeChipLabel: edsTokenFont('body-small', '400'),
    customizeChipLabelActive: edsTokenFont('body-small-strong', '500'),
    monoRowTitle: {
      fontFamily: 'Menlo',
    },
    pageTitle: edsTokenFont('headline', '700'),
    pageLead: edsTokenFont('body-medium', '400'),
    /** Large-title page subtitle — body-medium (17px). */
    pageSubtitle: edsTokenFont('body-medium', '400'),
  },
};

/** Generic shallow tile — fill `material-card-shallow` + `blockRadius` (token hub rows, nav cards, fences). */
export function showcaseShallowBlockSurface(backgroundColor: string): ViewStyle {
  return {
    backgroundColor,
    ...showcaseTheme.blockRadius,
  };
}

/** 列表卡片铺色 — `box-page`；与页面底同色时用 `material-card-shallow` 保持层次。 */
export function showcaseCardFillColor(colors: ShowcaseColorMap): string {
  const card = (colors['box-page'] as string | undefined) ?? '';
  const page = (colors['box-page-card'] as string | undefined) ?? '';
  if (card && page && card === page) {
    return (colors['material-card-shallow'] as string | undefined) ?? card;
  }
  return card;
}

/** Showcase 卡片容器 — 实底 + radius-lg；无描边 / 阴影。 */
export function showcasePageCardSurface(backgroundColor: string): ViewStyle {
  return {
    backgroundColor,
    ...showcaseTheme.blockRadius,
    overflow: 'hidden',
  };
}

/** 列表行 / 分组块统一卡片外观。 */
export function showcaseCardChromeStyle(
  colors: Parameters<typeof showcaseCardFillColor>[0],
): ViewStyle {
  return showcasePageCardSurface(showcaseCardFillColor(colors));
}

/** 全站页面根背景 — semantic `--box-page-card`（`colors.page` 同值）。 */
export function showcasePageBackgroundColor(colors: ShowcaseColorMap): string {
  return colors['box-page-card'] ?? colors.page ?? '';
}

/** @deprecated 与 {@link showcasePageBackgroundColor} 相同 */
export const showcaseDetailScreenBackgroundColor = showcasePageBackgroundColor;