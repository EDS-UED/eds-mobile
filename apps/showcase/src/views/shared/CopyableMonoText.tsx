import * as Clipboard from 'expo-clipboard';
import { Pressable, StyleSheet, Text, type TextStyle } from 'react-native';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

type CopyableMonoTextProps = {
  value: string;
  style?: TextStyle;
  color?: string;
};

export function CopyableMonoText({ value, style, color }: CopyableMonoTextProps) {
  const colors = useShowcaseColors();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`复制 ${value}`}
      onPress={() => {
        void Clipboard.setStringAsync(value);
      }}
      style={({ pressed }) => [pressed && styles.pressed]}
    >
      <Text
        selectable
        style={[styles.text, { color: color ?? (colors['text-base-secondary'] as string) }, style]}
      >
        {value}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  text: {
    ...theme.font.tokenReference,
  },
  pressed: {
    opacity: 0.6,
  },
});
