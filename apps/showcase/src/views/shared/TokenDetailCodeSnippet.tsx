import { Platform, useColorScheme } from 'react-native';

import { resolveColorTheme } from '@/data/tokens/colorTokenCatalog';
import type { TokenEntry } from '@/data/tokens/tokenCatalogTypes';
import { resolveTokenDetailNativeSnippet } from '@/data/tokens/tokenDetailNativeSnippet';
import { resolveTokenDetailSnippet } from '@/data/tokens/tokenDetailSnippet';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { HighlightedCssSnippet } from '@/views/shared/HighlightedCssSnippet';
import { ShowcasePlainCodeSnippet } from '@/views/shared/ShowcasePlainCodeSnippet';

type TokenDetailCodeSnippetProps = {
  categoryId: string;
  entry: TokenEntry;
};

/** Token detail fence — Web: dist CSS；iOS / Android: RN StyleSheet + API（真机 preview 真源）。 */
export function TokenDetailCodeSnippet({ categoryId, entry }: TokenDetailCodeSnippetProps) {
  const colors = useShowcaseColors();
  const scheme = useColorScheme();
  const mode = resolveColorTheme(scheme);
  const platform = Platform.OS;

  if (platform === 'web') {
    const css = resolveTokenDetailSnippet(categoryId, entry);
    return css ? <HighlightedCssSnippet snippet={css} /> : null;
  }

  const nativePlatform = platform === 'android' ? 'android' : 'ios';
  const snippet = resolveTokenDetailNativeSnippet(categoryId, entry, nativePlatform, mode, colors);
  return snippet ? (
    <ShowcasePlainCodeSnippet snippet={snippet} accessibilityLabel="复制 React Native 代码" />
  ) : null;
}
