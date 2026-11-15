import { EgSymbol } from '@eds/mobile-components/catalog';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';
import { ShowcaseSansText } from '@/components/ShowcaseSansText';

import { resolveTokenListPrimaryLabel } from '@/data/tokens/tokenListDisplayName';
import {
  resolveTokenListValueLabel,
  type TokenListRowValueEntry,
} from '@/data/tokens/tokenCatalogUtils';
import { showcaseDocSectionLayout } from '@/views/shared/showcaseDocSectionLayout';
import { showcaseCardChromeStyle, showcaseTheme as theme } from '@/views/shared/showcaseTheme';

type TokenRowEntry = TokenListRowValueEntry;

type TokenListRowProps = {
  categoryId: string;
  entry: TokenRowEntry;
  colors: ShowcaseColorMap;
  showAccessory?: boolean;
  /** `inset` — 组内一行；`card` — 独立卡片（少用）。 */
  variant?: 'card' | 'inset';
  showDivider?: boolean;
};

export function TokenListRow({
  categoryId,
  entry,
  colors,
  showAccessory = true,
  variant = 'card',
  showDivider = false,
}: TokenListRowProps) {
  const valueLabel = resolveTokenListValueLabel(categoryId, entry);
  const primaryLabel = resolveTokenListPrimaryLabel(categoryId, entry);
  const inset = variant === 'inset';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(`/(tokens)/${categoryId}/${entry.name}`)}
      style={[
        inset ? showcaseDocSectionLayout.insetRow : styles.card,
        !inset ? showcaseCardChromeStyle(colors) : null,
        showDivider
          ? [
              showcaseDocSectionLayout.insetDivider,
              { borderBottomColor: colors['stroke-divider-shallow'] },
            ]
          : null,
      ]}
    >
      <View style={showcaseDocSectionLayout.insetRowCopy}>
        <ShowcaseSansText
          weight="600"
          style={[
            showcaseDocSectionLayout.tokenRowTitle,
            { color: colors['text-base-primary'] as string },
          ]}
        >
          {primaryLabel}
        </ShowcaseSansText>
        {valueLabel ? (
          <ShowcaseSansText
            weight="400"
            style={[
              showcaseDocSectionLayout.tokenRowValue,
              { color: colors['text-base-tertiary'] as string },
            ]}
            numberOfLines={2}
          >
            {valueLabel}
          </ShowcaseSansText>
        ) : null}
      </View>
      {showAccessory ? (
        <View accessible={false} importantForAccessibility="no">
          <EgSymbol name="eds-arrow-right-mini-ios" size="xs" strokeColorToken="text-base-tertiary" />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    ...showcaseDocSectionLayout.insetRow,
    paddingVertical: theme.layout.cardPaddingVertical,
  },
});