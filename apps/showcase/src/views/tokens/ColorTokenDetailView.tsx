import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import { getColorTokenByName, resolveColorTheme } from '@/data/tokens/colorTokenCatalog';
import { resolveTokenListPrimaryLabel } from '@/data/tokens/tokenListDisplayName';
import type { DocPropRow } from '@/data/components';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { TokenDetailCodeSnippet } from '@/views/shared/TokenDetailCodeSnippet';
import { PropsDocCardList } from '@/views/shared/PropsDocCardList';
import { resolveTokenPreviewDestination } from '@/data/tokens/tokenPreviewDestination';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';
import { TokenDetailRootView } from '@/views/tokens/TokenDetailRootView';

function colorTokenPropRows(entry: {
  name: string;
  layer: string;
  cssVar: string;
  value: string;
  cssReference?: string;
}): DocPropRow[] {
  const rows: DocPropRow[] = [
    {
      name: entry.cssVar,
      type: 'color',
      defaultValue: entry.value,
      description: `layer · ${entry.layer}`,
    },
  ];
  if (entry.cssReference) {
    rows.push({
      name: 'reference',
      type: 'CSS',
      defaultValue: entry.cssReference,
      description: 'dist semantic',
    });
  }
  return rows;
}

export function ColorTokenDetailView() {
  const { tokenName } = useLocalSearchParams<{ tokenName: string }>();
  const colorTheme = resolveColorTheme(useColorScheme());
  const colors = useShowcaseColors();
  const entry = tokenName ? getColorTokenByName(tokenName, colorTheme) : undefined;

  if (!entry) {
    return (
      <View style={styles.missing}>
        <Text style={[styles.missingText, { color: colors['text-base-secondary'] as string }]}>
          未找到颜色 {tokenName}
        </Text>
      </View>
    );
  }

  const catalogEntry = {
    name: entry.name,
    layer: entry.layer,
    cssVar: entry.cssVar,
    detailLines: [],
  };

  const title = resolveTokenListPrimaryLabel('color', catalogEntry);

  return (
    <TokenDetailRootView
      title={title}
      layoutMode="reference"
      previewDestination={resolveTokenPreviewDestination('color', catalogEntry)}
      usageContent={<TokenDetailCodeSnippet categoryId="color" entry={catalogEntry} />}
      propsContent={<PropsDocCardList rows={colorTokenPropRows(entry)} />}
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
