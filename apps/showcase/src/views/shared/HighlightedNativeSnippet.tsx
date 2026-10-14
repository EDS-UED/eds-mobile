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

type HighlightedNativeSnippetProps = {
  snippet: string;
  accessibilityLabel?: string;
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
}: HighlightedNativeSnippetProps) {
  const colors = useShowcaseColors();
  const syntaxColors = useNativeSyntaxColors();
  const lines = snippet.split('\n');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={() => {
        void Clipboard.setStringAsync(snippet);
      }}
      style={({ pressed }) => [
        showcaseCodeBlockStyle(colors['material-card-shallow'] as string),
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
