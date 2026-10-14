import * as Clipboard from 'expo-clipboard';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useShowcaseTheme } from '@/hooks/useShowcaseTheme';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

type CodeSourceRefTextProps = {
  file: string;
  startLine: number;
  endLine: number;
};

export function CodeSourceRefText({ file, startLine, endLine }: CodeSourceRefTextProps) {
  const { docColors } = useShowcaseTheme();
  const label = `@${file} (${startLine}-${endLine})`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`复制 ${label}`}
      onPress={() => {
        void Clipboard.setStringAsync(label);
      }}
      style={({ pressed }) => [styles.root, pressed && styles.pressed]}
    >
      <Text selectable style={styles.text}>
        <Text style={{ color: docColors['code-symbol'] }}>@</Text>
        <Text style={{ color: docColors['code-string'] }}>{file}</Text>
        <Text style={{ color: docColors['code-comment'] }}> ({startLine}</Text>
        <Text style={{ color: docColors['code-comment'] }}>-</Text>
        <Text style={{ color: docColors['code-number'] }}>{endLine}</Text>
        <Text style={{ color: docColors['code-comment'] }}>)</Text>
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: 'center',
  },
  text: {
    ...theme.font.tokenReference,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
});
