import { router } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';

import {
  textStyleListLabel,
  textStyleMetricsLabel,
  textStyleRoleFromClassName,
  textStyleSampleStyle,
} from '@/data/tokens/typographyTextStyleUtils';
import { showcaseListPress } from '@/views/shared/showcaseListPress';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

type TypographyTextStyleRowProps = {
  className: string;
  colors: ShowcaseColorMap;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const { recipe: pressMotion, opacity: pressOpacity } = showcaseListPress;

export function TypographyTextStyleRow({ className, colors }: TypographyTextStyleRowProps) {
  const opacity = useSharedValue(1);
  const role = textStyleRoleFromClassName(className);
  const label = textStyleListLabel(className);
  const metrics = textStyleMetricsLabel(role);

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
      accessibilityLabel={label}
      onPress={() => router.push(`/(tokens)/typography/${className}`)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.row, animatedStyle]}
    >
      <Text style={[textStyleSampleStyle(role), styles.label, { color: colors['text-base-primary'] as string }]}>
        {label}
      </Text>
      <Text style={[styles.metrics, { color: colors['text-base-tertiary'] as string }]}>{metrics}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
    gap: theme.layout.tokenItemGap,
  },
  label: {
    flex: 1,
    flexShrink: 1,
  },
  metrics: {
    ...theme.font.tokenReference,
  },
});
