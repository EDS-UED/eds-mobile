import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { resolveTokenListPrimaryLabel } from '@/data/tokens/tokenListDisplayName';
import { resolveCatalogToken } from '@/data/tokens/tokenCategoryRegistry';
import { motionTokenPropRows } from '@/data/tokens/motionTokenPropRows';
import { resolveTokenPreviewDestination } from '@/data/tokens/tokenPreviewDestination';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { PropsDocCardList } from '@/views/shared/PropsDocCardList';
import { TokenDetailCodeSnippet } from '@/views/shared/TokenDetailCodeSnippet';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';
import { TokenDetailRootView } from '@/views/tokens/TokenDetailRootView';

/** Motion 令牌 — 仅 RN/CSS 片段与参数；Live 在动画 Tab。 */
export function MotionTokenDetailView() {
  const { tokenName } = useLocalSearchParams<{ tokenName: string }>();
  const colors = useShowcaseColors();
  const entry = tokenName ? resolveCatalogToken('motion', tokenName) : undefined;

  if (!entry) {
    return (
      <View style={styles.missing}>
        <Text style={[styles.missingText, { color: colors['text-base-secondary'] as string }]}>
          未找到 {tokenName}
        </Text>
      </View>
    );
  }

  const title = resolveTokenListPrimaryLabel('motion', entry);

  return (
    <TokenDetailRootView
      title={title}
      layoutMode="reference"
      previewDestination={resolveTokenPreviewDestination('motion', entry)}
      usageContent={<TokenDetailCodeSnippet categoryId="motion" entry={entry} />}
      propsContent={<PropsDocCardList rows={motionTokenPropRows(entry)} />}
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