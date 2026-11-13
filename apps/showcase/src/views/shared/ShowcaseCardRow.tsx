import { Pressable, StyleSheet, Text, View, type TextStyle } from 'react-native';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';

import { showcaseShallowBlockSurface, showcaseTheme as theme } from './showcaseTheme';

type ShowcaseCardRowProps = {
  title: string;
  hint?: string;
  onPress?: () => void;
  disabled?: boolean;
  monoTitle?: boolean;
  /** 无浅底块 — 族页「构成」等仅文本可点行。 */
  variant?: 'card' | 'plain';
};

export function ShowcaseCardRow({
  title,
  hint,
  onPress,
  disabled = false,
  monoTitle = false,
  variant = 'card',
}: ShowcaseCardRowProps) {
  const colors = useShowcaseColors();
  const inactiveOpacity = 0.5;

  const titleStyle: TextStyle = monoTitle
    ? { ...styles.title, ...styles.monoTitle }
    : styles.title;
  const isPlain = variant === 'plain';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={disabled ? undefined : onPress}
      style={[
        isPlain ? styles.plainRow : styles.card,
        !isPlain ? showcaseShallowBlockSurface(colors['material-card-shallow'] as string) : undefined,
        { opacity: disabled ? inactiveOpacity : 1 },
      ]}
    >
      <View style={styles.copy}>
        <Text style={[titleStyle, { color: colors['text-base-primary'] as string }]}>{title}</Text>
        {hint ? (
          <Text style={[styles.hint, { color: colors['text-base-secondary'] as string }]}>{hint}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: theme.layout.cardPaddingHorizontal,
    paddingVertical: theme.layout.cardPaddingVertical,
  },
  plainRow: {
    justifyContent: 'center',
    paddingVertical: theme.layout.titleHintGap,
  },
  copy: {
    gap: theme.layout.titleHintGap,
  },
  title: {
    ...theme.font.rowTitle,
  },
  monoTitle: {
    ...theme.font.monoRowTitle,
  },
  hint: {
    ...theme.font.rowHint,
  },
});
