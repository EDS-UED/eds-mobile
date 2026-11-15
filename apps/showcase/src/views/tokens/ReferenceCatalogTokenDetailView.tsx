import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import type { TokenEntry } from '@/data/tokens/tokenCatalogTypes';
import { tokenDetailPropRows } from '@/data/tokens/tokenDetailPropRows';
import { resolveTokenListPrimaryLabel } from '@/data/tokens/tokenListDisplayName';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { TokenDetailCodeSnippet } from '@/views/shared/TokenDetailCodeSnippet';
import { PropsDocCardList } from '@/views/shared/PropsDocCardList';
import { resolveTokenPreviewDestination } from '@/data/tokens/tokenPreviewDestination';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';
import { TokenDetailRootView } from '@/views/tokens/TokenDetailRootView';

type ReferenceCatalogTokenDetailViewProps = {
  categoryId: string;
  resolveEntry: (name: string) => TokenEntry | undefined;
};

/** Scale 等目录令牌 — 无预览/定制，仅片段与参数。 */
export function ReferenceCatalogTokenDetailView({
  categoryId,
  resolveEntry,
}: ReferenceCatalogTokenDetailViewProps) {
  const { tokenName } = useLocalSearchParams<{ tokenName: string }>();
  const colors = useShowcaseColors();
  const entry = tokenName ? resolveEntry(tokenName) : undefined;

  if (!entry) {
    return (
      <View style={styles.missing}>
        <Text style={[styles.missingText, { color: colors['text-base-secondary'] as string }]}>
          未找到 {tokenName}
        </Text>
      </View>
    );
  }

  const title = resolveTokenListPrimaryLabel(categoryId, entry);

  return (
    <TokenDetailRootView
      title={title}
      layoutMode="reference"
      previewDestination={resolveTokenPreviewDestination(categoryId, entry)}
      usageContent={<TokenDetailCodeSnippet categoryId={categoryId} entry={entry} />}
      propsContent={<PropsDocCardList rows={tokenDetailPropRows(entry)} />}
    />
  );
}

const styles = StyleSheet.create({
  missing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.layout.pageInset,
  },
  missingText: {
    ...theme.font.rowHint,
  },
});