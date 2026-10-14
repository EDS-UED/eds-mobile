import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { resolveTokenListPrimaryLabel } from '@/data/tokens/tokenListDisplayName';
import { resolveCatalogToken } from '@/data/tokens/tokenCategoryRegistry';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { useShowcaseScreenStyles } from '@/hooks/useShowcaseScreenStyles';
import { TokenDetailCodeSnippet } from '@/views/shared/TokenDetailCodeSnippet';
import { edsTokenFont } from '@/views/shared/resolveEdsTheme';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';
import { isGlassBoxPreviewClass } from '@/views/tokens/effectTokenPreviewStyle';
import { EffectTokenPreview } from '@/views/tokens/EffectTokenPreview';

export function EffectTokenDetailView() {
  const screenStyles = useShowcaseScreenStyles();
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
    <ScrollView
      style={screenStyles.scrollRoot}
      contentContainerStyle={[styles.content, isGlassBox ? styles.contentGlassBox : null]}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={styles.hero}>
        <EffectTokenPreview entry={entry} colors={colors} />
        <Text
          style={[
            styles.heroTitle,
            isGlassBox ? styles.heroTitleGlassBox : null,
            { color: colors['text-base-primary'] as string },
          ]}
        >
          {title}
        </Text>
        <View style={styles.formats}>
          <TokenDetailCodeSnippet categoryId="effect" entry={entry} />
        </View>
      </View>
    </ScrollView>
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
  contentGlassBox: {
    paddingTop: theme.layout.pageInset,
  },
  hero: {
    width: '100%',
    alignItems: 'center',
    overflow: 'visible',
  },
  heroTitle: {
    ...edsTokenFont('display', '700'),
    marginTop: theme.layout.tokenDetailSwatchTitleGap,
    textAlign: 'center',
  },
  heroTitleGlassBox: {
    marginTop: theme.layout.tokenDetailTitleSubtextGap,
  },
  formats: {
    alignSelf: 'stretch',
    marginTop: theme.layout.tokenDetailTitleSubtextGap,
    width: '100%',
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
