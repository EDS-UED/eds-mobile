import { useLocalSearchParams } from 'expo-router';

import { isTypographyTextStyleClassName } from '@/data/tokens/typographyTextStyleUtils';
import { resolveCatalogToken } from '@/data/tokens/tokenCategoryRegistry';
import { CatalogTokenDetailView } from '@/views/tokens/CatalogTokenDetailView';
import { ColorTokenDetailView } from '@/views/tokens/ColorTokenDetailView';
import { EffectTokenDetailView } from '@/views/tokens/EffectTokenDetailView';
import { TypographyTextStyleDetailView } from '@/views/tokens/TypographyTextStyleDetailView';

export default function TokenDetailScreen() {
  const { category, tokenName } = useLocalSearchParams<{ category: string; tokenName: string }>();

  if (category === 'color') {
    return <ColorTokenDetailView />;
  }

  if (category === 'effect') {
    return <EffectTokenDetailView />;
  }

  if (category === 'typography' && tokenName && isTypographyTextStyleClassName(tokenName)) {
    return <TypographyTextStyleDetailView />;
  }

  return (
    <CatalogTokenDetailView
      categoryId={category ?? ''}
      resolveEntry={(name) => (category ? resolveCatalogToken(category, name) : undefined)}
    />
  );
}
