import { useCallback, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { motionPressScale, type MotionPressIntensity } from './themeScalars.js';
import {
  pressScaleOutSpringConfig,
  tapPressScaleInSpringConfig,
} from './pressScaleSpring.js';
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type MotionPressableProps = {
  children: ReactNode | ((state: { pressed: boolean }) => ReactNode);
  disabled?: boolean;
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  style?: StyleProp<ViewStyle> | ((state: { pressed: boolean }) => StyleProp<ViewStyle>);
  testID?: string;
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'link' | 'none';
  /** 点按放大强度 — 默认 `md`。 */
  pressIntensity?: MotionPressIntensity;
};

function resolveStaticStyle(
  style: MotionPressableProps['style'],
  pressed: boolean,
): ViewStyle | undefined {
  const resolved = typeof style === 'function' ? style({ pressed }) : style;
  return StyleSheet.flatten(resolved) as ViewStyle | undefined;
}

export function MotionPressable({
  children,
  disabled,
  onPress,
  onPressIn,
  onPressOut,
  style,
  testID,
  accessibilityLabel,
  accessibilityRole = 'button',
  pressIntensity = 'sm',
}: MotionPressableProps) {
  const [pressed, setPressed] = useState(false);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: scale.value }],
    }),
    [scale],
  );

  const handlePressIn = useCallback(() => {
    setPressed(true);
    scale.value = withSpring(motionPressScale(pressIntensity), tapPressScaleInSpringConfig);
    onPressIn?.();
  }, [onPressIn, pressIntensity, scale]);

  const handlePressOut = useCallback(() => {
    setPressed(false);
    scale.value = withSpring(1, pressScaleOutSpringConfig);
    onPressOut?.();
  }, [onPressOut, scale]);

  const staticStyle = resolveStaticStyle(style, pressed);

  return (
    <AnimatedPressable
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      disabled={disabled}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[staticStyle, animatedStyle]}
    >
      {typeof children === 'function' ? children({ pressed }) : children}
    </AnimatedPressable>
  );
}
