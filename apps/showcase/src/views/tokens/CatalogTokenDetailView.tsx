import { useLocalSearchParams } from 'expo-router';
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';

import { TOKEN_DEMO_TEXT } from '@/data/tokens/tokenDemoText';
import type { TokenEntry } from '@/data/tokens/tokenCatalogTypes';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { TokenDetailCodeSnippet } from '@/views/shared/TokenDetailCodeSnippet';
import { edsTokenFont } from '@/views/shared/resolveEdsTheme';
import { useShowcaseScreenStyles } from '@/hooks/useShowcaseScreenStyles';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

type CatalogTokenDetailViewProps = {
  categoryId: string;
  resolveEntry: (name: string) => TokenEntry | undefined;
  renderPreview?: (entry: TokenEntry, colors: ShowcaseColorMap) => ReactNode;
};

export function CatalogTokenDetailView({
  categoryId,
  resolveEntry,
  renderPreview,
}: CatalogTokenDetailViewProps) {
  const screenStyles = useShowcaseScreenStyles();
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

  return (
    <>
      <ScrollView
        style={screenStyles.scrollRoot}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.hero}>
          {renderPreview?.(entry, colors)}
          <Text style={[styles.demoText, { color: colors['text-base-primary'] as string }]}>{TOKEN_DEMO_TEXT}</Text>
          <View style={[styles.formats, renderPreview ? styles.formatsWithPreview : null]}>
            <TokenDetailCodeSnippet categoryId={categoryId} entry={entry} />
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: theme.layout.scrollBottom,
    paddingHorizontal: theme.layout.pageInset,
    paddingTop: theme.layout.tokenBlockGap,
  },
  hero: {
    width: '100%',
    alignItems: 'center',
  },
  demoText: {
    ...edsTokenFont('body-large', '400'),
    textAlign: 'center',
  },
  formats: {
    alignSelf: 'stretch',
    marginTop: theme.layout.tokenDetailSwatchTitleGap,
    width: '100%',
  },
  formatsWithPreview: {
    marginTop: theme.layout.tokenDetailTitleSubtextGap,
  },
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
