import type { ViewStyle } from 'react-native';
import mobileTheme from '@eds/mobile-tokens/theme';

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
  /** Shallow card / list row / code fence — var(--radius-md) + continuous corner. */
  blockRadius: edsSmoothRadius('radius-md'),
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
