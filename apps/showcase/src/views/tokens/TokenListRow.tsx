import { EgSymbol } from '@eds/mobile-components/catalog';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';

import { resolveTokenListPrimaryLabel } from '@/data/tokens/tokenListDisplayName';
import {
  resolveTokenListValueLabel,
  type TokenListRowValueEntry,
} from '@/data/tokens/tokenCatalogUtils';

type TokenRowEntry = TokenListRowValueEntry;
import { showcaseListPress } from '@/views/shared/showcaseListPress';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

type TokenListRowProps = {
  categoryId: string;
  entry: TokenRowEntry;
  colors: ShowcaseColorMap;
  showAccessory?: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const { recipe: pressMotion, opacity: pressOpacity } = showcaseListPress;

export function TokenListRow({ categoryId, entry, colors, showAccessory = true }: TokenListRowProps) {
  const opacity = useSharedValue(1);
  const valueLabel = resolveTokenListValueLabel(categoryId, entry);
  const primaryLabel = resolveTokenListPrimaryLabel(categoryId, entry);

  const animatedStyle = useAnimatedStyle(
    () => ({
      opacity: opacity.value,
    }),
    [opacity],
  );

  const handlePressIn = useCallback(() => {
    opacity.value = withSpring(pressOpacity, pressMotion.springConfig);
  }, [opacity]);

  const handlePressOut = useCallback(() => {
    opacity.value = withSpring(1, pressMotion.springConfig);
  }, [opacity]);

  return (
    <AnimatedPressable
      accessibilityRole="button"
      onPress={() => router.push(`/(tokens)/${categoryId}/${entry.name}`)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.row, animatedStyle]}
    >
      <Text style={[styles.name, { color: colors['text-base-primary'] as string }]}>{primaryLabel}</Text>
      {valueLabel ? (
        <Text
          numberOfLines={1}
          style={[styles.value, { color: colors['text-base-tertiary'] as string }]}
        >
          {valueLabel}
        </Text>
      ) : null}
      {showAccessory ? (
        <View accessible={false} importantForAccessibility="no">
          <EgSymbol name="eds-arrow-right-mini-ios" size="xs" strokeColorToken="text-base-tertiary" />
        </View>
      ) : null}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.layout.tokenItemGap,
    minHeight: 32,
  },
  name: {
    flex: 1,
    flexShrink: 1,
    ...theme.font.tokenName,
  },
  value: {
    ...theme.font.tokenReference,
    flexShrink: 1,
    maxWidth: '52%',
  },
});
