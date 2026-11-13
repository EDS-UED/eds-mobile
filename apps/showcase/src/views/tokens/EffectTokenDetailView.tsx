import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { resolveTokenListPrimaryLabel } from '@/data/tokens/tokenListDisplayName';
import { resolveCatalogToken } from '@/data/tokens/tokenCategoryRegistry';
import { tokenDetailPropRows } from '@/data/tokens/tokenDetailPropRows';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { TokenDetailCodeSnippet } from '@/views/shared/TokenDetailCodeSnippet';
import { CustomizePanel } from '@/views/shared/CustomizePanel';
import { PropsDocTable } from '@/views/shared/PropsDocTable';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';
import { isGlassBoxPreviewClass } from '@/views/tokens/effectTokenPreviewStyle';
import { EffectTokenPreview } from '@/views/tokens/EffectTokenPreview';
import { TokenDetailRootView } from '@/views/tokens/TokenDetailRootView';

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
  const isGlassBox = isGlassBoxPreviewClass(entry.name);

  return (
    <TokenDetailRootView
      title={title}
      previewMinHeight={isGlassBox ? 220 : 160}
      preview={<EffectTokenPreview entry={entry} colors={colors} />}
      customize={<CustomizePanel controls={[]} state={{}} onChange={() => {}} />}
      usageContent={<TokenDetailCodeSnippet categoryId="effect" entry={entry} />}
      propsContent={<PropsDocTable rows={tokenDetailPropRows(entry)} />}
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
