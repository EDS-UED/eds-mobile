import { EgSymbol } from '@eds/mobile-components/catalog';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { ShowcaseSansText } from '@/components/ShowcaseSansText';
import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';

import {
  textStyleListLabel,
  textStyleMetricsLabel,
  textStyleRoleFromClassName,
  textStyleSampleStyle,
} from '@/data/tokens/typographyTextStyleUtils';
import { showcaseCardChromeStyle, showcaseTheme as theme } from '@/views/shared/showcaseTheme';

type TypographyTextStyleRowProps = {
  className: string;
  colors: ShowcaseColorMap;
  variant?: 'card' | 'inset';
  showDivider?: boolean;
};

export function TypographyTextStyleRow({
  className,
  colors,
  variant = 'card',
  showDivider = false,
}: TypographyTextStyleRowProps) {
  const role = textStyleRoleFromClassName(className);
  const label = textStyleListLabel(className);
  const metrics = textStyleMetricsLabel(role);
  const inset = variant === 'inset';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => router.push(`/(tokens)/typography/${className}`)}
      style={[
        inset ? styles.insetRow : styles.card,
        !inset ? showcaseCardChromeStyle(colors) : null,
        showDivider
          ? { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors['stroke-divider-shallow'] }
          : null,
      ]}
    >
      <Text style={[textStyleSampleStyle(role), styles.sample, { color: colors['text-base-primary'] as string }]}>
        {label}
      </Text>
      <ShowcaseSansText
        weight="400"
        style={[styles.metrics, { color: colors['text-base-tertiary'] as string }]}
      >
        {metrics}
      </ShowcaseSansText>
      {inset ? (
        <EgSymbol name="eds-arrow-right-mini-ios" size="xs" strokeColorToken="text-base-tertiary" />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: theme.layout.cardPaddingHorizontal,
    paddingVertical: theme.layout.cardPaddingVertical,
    gap: theme.layout.titleHintGap,
  },
  insetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.layout.tokenItemGap,
    paddingHorizontal: theme.layout.cardPaddingHorizontal,
    paddingVertical: theme.spacing['spacing-3'] as number,
  },
  sample: {
    flex: 1,
    textAlign: 'left',
  },
  metrics: {
    ...theme.font.tokenReference,
  },
});