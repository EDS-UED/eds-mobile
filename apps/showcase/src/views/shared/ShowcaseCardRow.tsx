import { Pressable, StyleSheet, View, type TextStyle } from 'react-native';

import { ShowcaseSansText } from '@/components/ShowcaseSansText';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';

import { showcaseCardChromeStyle, showcaseTheme as theme } from './showcaseTheme';

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
        !isPlain ? showcaseCardChromeStyle(colors) : undefined,
        { opacity: disabled ? inactiveOpacity : 1 },
      ]}
    >
      <View style={styles.copy}>
        <ShowcaseSansText
          weight="600"
          style={[titleStyle, { color: colors['text-base-primary'] as string }]}
        >
          {title}
        </ShowcaseSansText>
        {hint ? (
          <ShowcaseSansText
            weight="400"
            style={[styles.hint, { color: colors['text-base-secondary'] as string }]}
          >
            {hint}
          </ShowcaseSansText>
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
    minHeight: 52,
    paddingVertical: theme.layout.cardPaddingVertical,
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
