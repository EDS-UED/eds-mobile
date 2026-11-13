import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { TOKEN_DEMO_TEXT } from '@/data/tokens/tokenDemoText';
import type { TokenEntry } from '@/data/tokens/tokenCatalogTypes';
import type { TokenDetailCustomizeState } from '@/data/tokens/tokenDetailCustomize';
import { resolveTokenListValueLabel } from '@/data/tokens/tokenCatalogUtils';
import { resolveTokenListPrimaryLabel } from '@/data/tokens/tokenListDisplayName';
import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';
import { edsTokenFont } from '@/views/shared/resolveEdsTheme';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';
import { AnimasTokenDetailPreview } from '@/views/tokens/AnimasTokenDetailPreview';
import { EffectTokenPreview } from '@/views/tokens/EffectTokenPreview';

type TokenDetailPreviewProps = {
  categoryId: string;
  entry: TokenEntry;
  colors: ShowcaseColorMap;
  customize: TokenDetailCustomizeState;
  renderPreview?: (entry: TokenEntry, colors: ShowcaseColorMap) => ReactNode;
};

function DefaultCatalogPreview({
  categoryId,
  entry,
  colors,
}: Omit<TokenDetailPreviewProps, 'customize' | 'renderPreview'>) {
  const valueLabel = resolveTokenListValueLabel(categoryId, entry);
  const title = resolveTokenListPrimaryLabel(categoryId, entry);

  return (
    <View style={styles.defaultBlock}>
      <Text style={[styles.title, { color: colors['text-base-primary'] as string }]}>{title}</Text>
      {valueLabel ? (
        <Text style={[styles.value, { color: colors['text-base-tertiary'] as string }]}>{valueLabel}</Text>
      ) : (
        <Text style={[styles.demo, { color: colors['text-base-primary'] as string }]}>{TOKEN_DEMO_TEXT}</Text>
      )}
    </View>
  );
}

export function TokenDetailPreview({
  categoryId,
  entry,
  colors,
  customize,
  renderPreview,
}: TokenDetailPreviewProps) {
  if (renderPreview) {
    return <>{renderPreview(entry, colors)}</>;
  }

  if (categoryId === 'motion') {
    return <AnimasTokenDetailPreview entry={entry} colors={colors} customize={customize} />;
  }

  if (categoryId === 'effect') {
    return <EffectTokenPreview entry={entry} colors={colors} />;
  }

  return <DefaultCatalogPreview categoryId={categoryId} entry={entry} colors={colors} />;
}

const styles = StyleSheet.create({
  defaultBlock: {
    width: '100%',
    alignItems: 'center',
    gap: theme.layout.cardGap,
    paddingVertical: theme.layout.cardPaddingVertical,
  },
  title: {
    ...edsTokenFont('display', '700'),
    textAlign: 'center',
  },
  value: {
    ...theme.font.tokenReference,
    textAlign: 'center',
  },
  demo: {
    ...edsTokenFont('body-large', '400'),
    textAlign: 'center',
  },
});
