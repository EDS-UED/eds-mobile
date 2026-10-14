import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { getTypographyTokenByName } from '@/data/tokens/typographyTokenCatalog';
import { TOKEN_DEMO_TEXT } from '@/data/tokens/tokenDemoText';
import {
  isTypographyTextStyleClassName,
  textStyleRoleFromClassName,
  textStyleSampleStyle,
} from '@/data/tokens/typographyTextStyleUtils';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { TokenDetailCodeSnippet } from '@/views/shared/TokenDetailCodeSnippet';
import { useShowcaseScreenStyles } from '@/hooks/useShowcaseScreenStyles';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

export function TypographyTextStyleDetailView() {
  const screenStyles = useShowcaseScreenStyles();
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

  const role = textStyleRoleFromClassName(entry.name);

  return (
    <>
      <ScrollView
        style={screenStyles.scrollRoot}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.hero}>
          <Text style={[textStyleSampleStyle(role), styles.sample, { color: colors['text-base-primary'] as string }]}>
            {TOKEN_DEMO_TEXT}
          </Text>
          <View style={styles.formats}>
            <TokenDetailCodeSnippet categoryId="typography" entry={entry} />
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
  sample: {
    textAlign: 'center',
  },
  formats: {
    alignSelf: 'stretch',
    marginTop: theme.layout.tokenDetailSwatchTitleGap,
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
