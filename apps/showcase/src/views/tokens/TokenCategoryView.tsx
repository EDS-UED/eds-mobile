import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { getTokenCategoryConfig } from '@/data/tokens/tokenCategoryRegistry';
import { tokenCategories } from '@/data/tokens/tokenNav';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { useShowcaseScreenStyles } from '@/hooks/useShowcaseScreenStyles';
import { ColorTokensView } from '@/views/tokens/ColorTokensView';
import { CatalogTokensView } from '@/views/tokens/CatalogTokensView';
import { LiquidGlassTokensView } from '@/views/tokens/LiquidGlassTokensView';
import { TypographyTokensView } from '@/views/tokens/TypographyTokensView';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

export function TokenCategoryView() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const colors = useShowcaseColors();
  const screenStyles = useShowcaseScreenStyles();
  const category = tokenCategories.find((item) => item.id === categoryId);
  const config = getTokenCategoryConfig(categoryId ?? '');

  if (!category) {
    return (
      <View style={screenStyles.scrollRoot}>
        <Text style={[styles.missing, { color: colors['text-base-secondary'] as string }]}>
          未找到分类 {categoryId}
        </Text>
      </View>
    );
  }

  if (category.id === 'color') {
    return <ColorTokensView title={category.label} />;
  }

  if (category.id === 'typography') {
    return <TypographyTokensView title={category.label} />;
  }

  if (category.id === 'liquid-glass') {
    return <LiquidGlassTokensView />;
  }

  if (!config) {
    return (
      <View style={screenStyles.scrollRoot}>
        <Text style={[styles.missing, { color: colors['text-base-secondary'] as string }]}>
          未找到分类配置 {categoryId}
        </Text>
      </View>
    );
  }

  return (
    <CatalogTokensView
      categoryId={config.routeId}
      sections={config.getSections()}
      title={category.label}
    />
  );
}

const styles = StyleSheet.create({
  missing: {
    padding: theme.layout.pageInset,
  },
});
