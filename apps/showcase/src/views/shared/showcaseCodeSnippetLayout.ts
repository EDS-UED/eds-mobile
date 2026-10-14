import { StyleSheet, type ViewStyle } from 'react-native';

import { edsFontFamily } from '@/lib/edsFontFamily';
import { edsTypographyRole } from '@/views/shared/resolveEdsTheme';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

const detailCode = edsTypographyRole('detail');

/** Shared code fence — shallow block surface + spacing-5 × spacing-4. */
export const showcaseCodeSnippetLayout = StyleSheet.create({
  block: {
    ...theme.blockRadius,
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    paddingHorizontal: theme.layout.cardPaddingHorizontal,
    paddingVertical: theme.layout.cardPaddingVertical,
    width: '100%',
  },
  lines: {
    alignSelf: 'stretch',
    gap: theme.spacing['spacing-2'] as number,
  },
  line: {
    alignSelf: 'stretch',
    fontFamily: edsFontFamily('400', 'mono'),
    fontSize: detailCode.fontSize,
    lineHeight: detailCode.lineHeight,
    textAlign: 'left',
  },
  pressed: {
    opacity: 0.92,
  },
});

export function showcaseCodeBlockStyle(backgroundColor: string): ViewStyle {
  return {
    ...showcaseCodeSnippetLayout.block,
    backgroundColor,
  };
}
