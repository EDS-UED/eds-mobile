import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { useShowcaseTabBarInset } from '@/hooks/useShowcaseTabBarInset';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

/** Scroll / list shell styles — background & text follow system light/dark. */
export function useShowcaseScreenStyles() {
  const colors = useShowcaseColors();

  return useMemo(
    () =>
      StyleSheet.create({
        scrollRoot: {
          flex: 1,
          backgroundColor: colors['box-page'] as string,
        },
        scrollContent: {
          paddingBottom: theme.layout.scrollBottom,
          gap: theme.layout.cardGap,
          paddingTop: theme.layout.navContentGapHome,
        },
        scrollContentInner: {
          paddingBottom: theme.layout.scrollBottom,
          gap: theme.layout.cardGap,
          paddingTop: theme.layout.navContentGapInner,
        },
        cardList: {
          paddingHorizontal: theme.layout.pageInset,
          gap: theme.layout.cardGap,
        },
        missing: {
          padding: theme.layout.pageInset,
          color: colors['text-base-secondary'] as string,
        },
      }),
    [colors],
  );
}
