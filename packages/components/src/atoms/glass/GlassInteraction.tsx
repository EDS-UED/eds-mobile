import { useCallback, type ReactNode } from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { motionGlassPressScale } from '../../shared/themeScalars.js';
import {
  glassPressScaleInSpringConfig,
  pressScaleOutSpringConfig,
} from '../../shared/pressScaleSpring.js';
import { triggerGlassPressHaptic } from './glassPressHaptic.js';
import type { GlassInteractionProps } from './types.js';
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function GlassInteraction({
  press = true,
  pressIntensity = 'sm',
  shimmer: _shimmer = true,
  lightResponse: _lightResponse = true,
  deformation: _deformation = true,
  haptic = true,
  disabled,
  onPress,
  onPressIn,
  onPressOut,
  testID,
  accessibilityLabel,
  style,
  children,
}: GlassInteractionProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: scale.value }],
    }),
    [scale],
  );

  const handlePressIn = useCallback(() => {
    if (press) {
      scale.value = withSpring(motionGlassPressScale(pressIntensity), glassPressScaleInSpringConfig);
    }
    if (haptic) {
      triggerGlassPressHaptic();
    }
    onPressIn?.();
  }, [haptic, onPressIn, press, pressIntensity, scale]);

  const handlePressOut = useCallback(() => {
    if (press) {
      scale.value = withSpring(1, pressScaleOutSpringConfig);
    }
    onPressOut?.();
  }, [onPressOut, press, scale]);

  return (
    <AnimatedPressable
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[StyleSheet.flatten(style), animatedStyle] as StyleProp<ViewStyle>}
    >
      {children as ReactNode}
    </AnimatedPressable>
  );
}
