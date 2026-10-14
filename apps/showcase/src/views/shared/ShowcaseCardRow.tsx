import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View, type TextStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { resolveMotionRecipe } from '@eds/mobile-animations';
import mobileTheme from '@eds/mobile-tokens/theme';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';

import { showcaseShallowBlockSurface, showcaseTheme as theme } from './showcaseTheme';

type ShowcaseCardRowProps = {
  title: string;
  hint?: string;
  onPress?: () => void;
  disabled?: boolean;
  monoTitle?: boolean;
};

const pressMotion = resolveMotionRecipe('press');
const pressScale = mobileTheme.motion.scale['scale-press'] as number;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ShowcaseCardRow({
  title,
  hint,
  onPress,
  disabled = false,
  monoTitle = false,
}: ShowcaseCardRowProps) {
  const colors = useShowcaseColors();
  const scale = useSharedValue(1);
  const inactiveOpacity = mobileTheme.motion.opacity['opacity-disabled'] as number;

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: scale.value }],
    }),
    [scale],
  );

  const handlePressIn = useCallback(() => {
    if (disabled) {
      return;
    }
    scale.value = withSpring(pressScale, pressMotion.springConfig);
  }, [disabled, scale]);

  const handlePressOut = useCallback(() => {
    if (disabled) {
      return;
    }
    scale.value = withSpring(1, pressMotion.springConfig);
  }, [disabled, scale]);

  const titleStyle: TextStyle = monoTitle
    ? { ...styles.title, ...styles.monoTitle }
    : styles.title;

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={disabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.card,
        animatedStyle,
        showcaseShallowBlockSurface(colors['material-card-shallow'] as string),
        { opacity: disabled ? inactiveOpacity : 1 },
      ]}
    >
      <View style={styles.copy}>
        <Text style={[titleStyle, { color: colors['text-base-primary'] as string }]}>{title}</Text>
        {hint ? (
          <Text style={[styles.hint, { color: colors['text-base-secondary'] as string }]}>{hint}</Text>
        ) : null}
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: theme.layout.cardPaddingHorizontal,
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
