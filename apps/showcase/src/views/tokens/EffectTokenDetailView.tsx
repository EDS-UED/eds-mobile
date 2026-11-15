import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { resolveTokenListPrimaryLabel } from '@/data/tokens/tokenListDisplayName';
import { resolveCatalogToken } from '@/data/tokens/tokenCategoryRegistry';
import { effectTokenPropRows } from '@/data/tokens/effectTokenPropRows';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { TokenDetailCodeSnippet } from '@/views/shared/TokenDetailCodeSnippet';
import { PropsDocCardList } from '@/views/shared/PropsDocCardList';
import { resolveTokenPreviewDestination } from '@/data/tokens/tokenPreviewDestination';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';
import { TokenDetailRootView } from '@/views/tokens/TokenDetailRootView';

/** Effect 令牌 — 参数真源；主屏 USAGE（CSS / RN 片段）+ PROPS，无预览定制。 */
export function EffectTokenDetailView() {
  const { tokenName } = useLocalSearchParams<{ tokenName: string }>();
  const colors = useShowcaseColors();
  const entry = tokenName ? resolveCatalogToken('effect', tokenName) : undefined;

  if (!entry) {
    return (
      <View style={styles.missing}>
        <Text style={[styles.missingText, { color: colors['text-base-secondary'] as string }]}>
          未找到 {tokenName}
        </Text>
      </View>
    );
  }

  const title = resolveTokenListPrimaryLabel('effect', entry);

  return (
    <TokenDetailRootView
      title={title}
      layoutMode="reference"
      previewDestination={resolveTokenPreviewDestination('effect', entry)}
      usageContent={<TokenDetailCodeSnippet categoryId="effect" entry={entry} />}
      propsContent={<PropsDocCardList rows={effectTokenPropRows(entry)} />}
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