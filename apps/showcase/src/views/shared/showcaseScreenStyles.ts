/**
 * @deprecated Use `useShowcaseScreenStyles()` — static styles locked to light theme.
 * Kept temporarily for layout-only re-exports; do not use scrollRoot / missing from here.
 */
import { StyleSheet } from 'react-native';

import { showcaseTheme as theme } from './showcaseTheme';

export const showcaseScreenLayoutStyles = StyleSheet.create({
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
});
