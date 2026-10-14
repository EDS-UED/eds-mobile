import { useCallback, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { resolveMotionRecipe } from '@eds/mobile-animations';
import { motionPressScale } from './themeScalars.js';

const pressMotion = resolveMotionRecipe('press');
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
    scale.value = withSpring(motionPressScale(), pressMotion.springConfig);
    onPressIn?.();
  }, [onPressIn, scale]);

  const handlePressOut = useCallback(() => {
    setPressed(false);
    scale.value = withSpring(1, pressMotion.springConfig);
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
