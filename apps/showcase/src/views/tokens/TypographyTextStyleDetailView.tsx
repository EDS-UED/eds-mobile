import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { getTypographyTokenByName } from '@/data/tokens/typographyTokenCatalog';
import { tokenDetailPropRows } from '@/data/tokens/tokenDetailPropRows';
import { isTypographyTextStyleClassName } from '@/data/tokens/typographyTextStyleUtils';
import { resolveTokenListPrimaryLabel } from '@/data/tokens/tokenListDisplayName';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { TokenDetailCodeSnippet } from '@/views/shared/TokenDetailCodeSnippet';
import { PropsDocCardList } from '@/views/shared/PropsDocCardList';
import { resolveTokenPreviewDestination } from '@/data/tokens/tokenPreviewDestination';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';
import { TokenDetailRootView } from '@/views/tokens/TokenDetailRootView';

export function TypographyTextStyleDetailView() {
  const { tokenName } = useLocalSearchParams<{ tokenName: string }>();
  const colors = useShowcaseColors();
  const entry = tokenName ? getTypographyTokenByName(tokenName) : undefined;

  if (!entry || !isTypographyTextStyleClassName(entry.name)) {
    return (
      <View style={styles.missing}>
        <Text style={[styles.missingText, { color: colors['text-base-secondary'] as string }]}>
          未找到 {tokenName}
        </Text>
      </View>
    );
  }

  const title = resolveTokenListPrimaryLabel('typography', entry);

  return (
    <TokenDetailRootView
      title={title}
      layoutMode="reference"
      previewDestination={resolveTokenPreviewDestination('typography', entry)}
      usageContent={<TokenDetailCodeSnippet categoryId="typography" entry={entry} />}
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