import * as Clipboard from 'expo-clipboard';
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import {
  resolveNativeSnippetSyntaxColors,
  type NativeSnippetSyntaxColors,
} from '@/theme/showcaseDocColors';
import { tokenizeNativeSnippetLine } from '@/views/shared/highlightNativeSnippet';
import {
  showcaseCodeBlockStyle,
  showcaseCodeSnippetLayout,
} from '@/views/shared/showcaseCodeSnippetLayout';
import { showcaseCardFillColor } from '@/views/shared/showcaseTheme';

type HighlightedNativeSnippetProps = {
  snippet: string;
  accessibilityLabel?: string;
  /** `embedded` — 置于 {@link DocSection} 卡内，不叠第二层浅底与 padding。 */
  surface?: 'standalone' | 'embedded';
};

function useNativeSyntaxColors(): NativeSnippetSyntaxColors {
  const colorScheme = useColorScheme();
  const colors = useShowcaseColors();

  return resolveNativeSnippetSyntaxColors(colorScheme === 'dark' ? 'dark' : 'light', {
    primary: colors['text-base-primary'] as string,
    tertiary: colors['text-base-tertiary'] as string,
  });
}

function NativeLine({ line, syntaxColors }: { line: string; syntaxColors: NativeSnippetSyntaxColors }) {
  const tokens = tokenizeNativeSnippetLine(line);

  return (
    <Text style={showcaseCodeSnippetLayout.line}>
      {tokens.map((token, index) => (
        <Text
          key={`${token.kind}-${index}-${token.text}`}
          style={[
            { color: syntaxColors[token.kind] },
            token.kind === 'comment' ? styles.comment : null,
          ]}
        >
          {token.text}
        </Text>
      ))}
    </Text>
  );
}

export function HighlightedNativeSnippet({
  snippet,
  accessibilityLabel = '复制代码',
  surface = 'standalone',
}: HighlightedNativeSnippetProps) {
  const colors = useShowcaseColors();
  const syntaxColors = useNativeSyntaxColors();
  const lines = snippet.split('\n');
  const embedded = surface === 'embedded';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={() => {
        void Clipboard.setStringAsync(snippet);
      }}
      style={({ pressed }) => [
        embedded ? showcaseCodeSnippetLayout.embeddedBlock : showcaseCodeBlockStyle(showcaseCardFillColor(colors)),
        pressed && showcaseCodeSnippetLayout.pressed,
      ]}
    >
      <View style={showcaseCodeSnippetLayout.lines}>
        {lines.map((line, index) => (
          <NativeLine key={`${index}-${line}`} line={line} syntaxColors={syntaxColors} />
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  comment: {
    fontStyle: 'italic',
  },
});
