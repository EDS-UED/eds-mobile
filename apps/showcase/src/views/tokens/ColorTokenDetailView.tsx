import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { getColorTokenByName, resolveColorTheme } from '@/data/tokens/colorTokenCatalog';
import { resolveTokenListPrimaryLabel } from '@/data/tokens/tokenListDisplayName';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { edsFontFamily } from '@/lib/edsFontFamily';
import { TokenDetailCodeSnippet } from '@/views/shared/TokenDetailCodeSnippet';
import { useShowcaseScreenStyles } from '@/hooks/useShowcaseScreenStyles';
import { edsTypographyRole } from '@/views/shared/resolveEdsTheme';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';
import { ColorTokenSwatch } from '@/views/tokens/ColorTokenSwatch';

/** Color detail hero swatch — fixed preview size (px). */
const COLOR_DETAIL_SWATCH_PX = 192;

export function ColorTokenDetailView() {
  const screenStyles = useShowcaseScreenStyles();
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

  return (
    <>
      <ScrollView
        style={screenStyles.scrollRoot}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.hero}>
          <ColorTokenSwatch value={entry.value} size={COLOR_DETAIL_SWATCH_PX} />
          <Text style={[styles.heroTitle, { color: colors['text-base-primary'] as string }]}>
            {resolveTokenListPrimaryLabel('color', catalogEntry)}
          </Text>
          <View style={styles.formats}>
            <TokenDetailCodeSnippet categoryId="color" entry={catalogEntry} />
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
  /** typography-display · centered */
  heroTitle: {
    ...edsTypographyRole('display'),
    fontFamily: edsFontFamily('700'),
    marginTop: theme.layout.tokenDetailSwatchTitleGap,
    textAlign: 'center',
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
