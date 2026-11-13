import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { EdsRecipeAnima } from '@eds/mobile-animations';
import mobileTheme from '@eds/mobile-tokens/theme';
import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';

import { parseHexColor } from '@/data/tokens/colorFormats';
import type { ColorTokenEntry } from '@/data/tokens/colorTokenCatalog';
import { resolveTokenListPrimaryLabel } from '@/data/tokens/tokenListDisplayName';
import { edsFontFamily } from '@/lib/edsFontFamily';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

type ColorTokenBaseTileProps = {
  entry: ColorTokenEntry;
  colors: ShowcaseColorMap;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const pressMotion = EdsRecipeAnima('press');
const pressScale = mobileTheme.motion.scale['scale-press'] as number;
function isLightFill(value: string) {
  if (value === 'transparent') {
    return true;
  }

  const rgb = parseHexColor(value);
  if (!rgb) {
    return false;
  }

  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.62;
}

export function ColorTokenBaseTile({ entry, colors }: ColorTokenBaseTileProps) {
  const scale = useSharedValue(1);
  const isTransparent = entry.value === 'transparent' || /^#[0-9a-f]{6}00$/i.test(entry.value);
  const lightFill = isLightFill(entry.value);

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

  const needsBorder = isTransparent || lightFill;

  const tileStyle = useMemo(
    () => ({
      backgroundColor: isTransparent ? (colors['box-page'] as string) : entry.value,
      borderColor: needsBorder ? (colors['stroke-divider-shallow'] as string) : undefined,
      borderWidth: needsBorder ? 1 : 0,
    }),
    [entry.value, isTransparent, needsBorder],
  );

  const labelColor = lightFill
    ? (colors['text-base-primary'] as string)
    : (colors['text-face-primary'] as string);

  return (
    <AnimatedPressable
      accessibilityRole="button"
      onPress={() => router.push(`/(tokens)/color/${entry.name}` as const)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.tile, tileStyle, animatedStyle]}
    >
      <Text style={[styles.name, { color: labelColor }]}>
        {resolveTokenListPrimaryLabel('color', entry)}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: '100%',
    minHeight: 56,
    ...theme.blockRadius,
    paddingHorizontal: theme.layout.tokenBaseTilePaddingHorizontal,
    paddingVertical: theme.layout.tokenBaseTilePaddingVertical,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  name: {
    ...theme.font.tokenName,
    fontFamily: edsFontFamily('600'),
    fontWeight: '600',
  },
});
