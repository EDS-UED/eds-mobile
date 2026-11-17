import { EG_PAGE_CONTENT_PADDING_HORIZONTAL } from '@eds/mobile-components';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { useShowcaseTabBarInset } from '@/hooks/useShowcaseTabBarInset';
import { showcasePageBackgroundColor, showcaseTheme as theme } from '@/views/shared/showcaseTheme';

/** Scroll / list shell styles — background & text follow system light/dark. */
export function useShowcaseScreenStyles() {
  const colors = useShowcaseColors();
  const tabBarInset = useShowcaseTabBarInset();
  const pagePadH = EG_PAGE_CONTENT_PADDING_HORIZONTAL as number;

  return useMemo(
    () =>
      StyleSheet.create({
        scrollRoot: {
          flex: 1,
          backgroundColor: showcasePageBackgroundColor(colors),
        },
        /** 遗留 `ScrollView` — 与 `EgPage` 同水平 spacing-5。 */
        scrollContent: {
          paddingHorizontal: pagePadH,
          paddingBottom: theme.layout.scrollBottom + tabBarInset,
          gap: theme.layout.cardGap,
          paddingTop: theme.layout.navContentGapHome,
        },
        scrollContentInner: {
          paddingHorizontal: pagePadH,
          paddingBottom: theme.layout.scrollBottom + tabBarInset,
          gap: theme.layout.cardGap,
          paddingTop: theme.layout.navContentGapInner,
        },
        cardList: {
          gap: theme.layout.cardGap,
        },
        missing: {
          padding: theme.layout.pageInset,
          color: colors['text-base-secondary'] as string,
        },
      }),
    [colors, pagePadH, tabBarInset],
  );
}