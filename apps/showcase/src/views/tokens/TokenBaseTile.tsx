import { router } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { resolveMotionRecipe } from '@eds/mobile-animations';
import mobileTheme from '@eds/mobile-tokens/theme';
import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';

import type { TokenEntry } from '@/data/tokens/tokenCatalogTypes';
import { resolveTokenListPrimaryLabel } from '@/data/tokens/tokenListDisplayName';
import { tokenListValueLabel } from '@/data/tokens/tokenCatalogUtils';
import { showcaseShallowBlockSurface, showcaseTheme as theme } from '@/views/shared/showcaseTheme';

type TokenBaseTileProps = {
  categoryId: string;
  entry: TokenEntry;
  colors: ShowcaseColorMap;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const pressMotion = resolveMotionRecipe('press');
const pressScale = mobileTheme.motion.scale['scale-press'] as number;

export function TokenBaseTile({ categoryId, entry, colors }: TokenBaseTileProps) {
  const scale = useSharedValue(1);
  const valueLabel = tokenListValueLabel(categoryId, entry);

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: scale.value }],
    }),
    [scale],
  );

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(pressScale, pressMotion.springConfig);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, pressMotion.springConfig);
  }, [scale]);

  return (
    <AnimatedPressable
      accessibilityRole="button"
      onPress={() => router.push(`/(tokens)/${categoryId}/${entry.name}`)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.tile,
        {
          backgroundColor: colors['material-card-shallow'] as string,
          borderColor: colors['stroke-divider-page'] as string,
        },
        animatedStyle,
      ]}
    >
      <View style={styles.row}>
        <Text style={[styles.name, { color: colors['text-base-primary'] as string }]}>
          {resolveTokenListPrimaryLabel(categoryId, entry)}
        </Text>
        {valueLabel ? (
          <Text
            numberOfLines={1}
            style={[styles.value, { color: colors['text-base-tertiary'] as string }]}
          >
            {valueLabel}
          </Text>
        ) : null}
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: '100%',
    minHeight: 56,
    ...theme.blockRadius,
    borderWidth: 1,
    paddingHorizontal: theme.layout.tokenBaseTilePaddingHorizontal,
    paddingVertical: theme.layout.tokenBaseTilePaddingVertical,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.layout.tokenItemGap,
    width: '100%',
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
