import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { getTypographyTokenByName } from '@/data/tokens/typographyTokenCatalog';
import { TOKEN_DEMO_TEXT } from '@/data/tokens/tokenDemoText';
import { tokenDetailPropRows } from '@/data/tokens/tokenDetailPropRows';
import {
  isTypographyTextStyleClassName,
  textStyleRoleFromClassName,
  textStyleSampleStyle,
} from '@/data/tokens/typographyTextStyleUtils';
import { resolveTokenListPrimaryLabel } from '@/data/tokens/tokenListDisplayName';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { TokenDetailCodeSnippet } from '@/views/shared/TokenDetailCodeSnippet';
import { CustomizePanel } from '@/views/shared/CustomizePanel';
import { PropsDocTable } from '@/views/shared/PropsDocTable';
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

  const role = textStyleRoleFromClassName(entry.name);
  const title = resolveTokenListPrimaryLabel('typography', entry);

  return (
    <TokenDetailRootView
      title={title}
      preview={
        <Text
          style={[
            textStyleSampleStyle(role),
            styles.sample,
            { color: colors['text-base-primary'] as string },
          ]}
        >
          {TOKEN_DEMO_TEXT}
        </Text>
      }
      customize={<CustomizePanel controls={[]} state={{}} onChange={() => {}} />}
      usageContent={<TokenDetailCodeSnippet categoryId="typography" entry={entry} />}
      propsContent={<PropsDocTable rows={tokenDetailPropRows(entry)} />}
    />
  );
}

const styles = StyleSheet.create({
  sample: {
    textAlign: 'center',
    paddingVertical: theme.layout.cardPaddingVertical,
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
