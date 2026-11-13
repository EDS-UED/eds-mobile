import type { ReactNode } from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import type { MotionPressIntensity, MotionPressScaleDirection } from '../themeScalars.js';
import { useMotionPressScale, type MotionPressRecipe } from '../useMotionPressScale.js';
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type EgEdsAnimaPressProps = {
  children: ReactNode | ((state: { pressed: boolean }) => ReactNode);
  disabled?: boolean;
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  style?: StyleProp<ViewStyle> | ((state: { pressed: boolean }) => StyleProp<ViewStyle>);
  testID?: string;
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'link' | 'none';
  /** 点按放大强度 — 默认 `sm`。 */
  pressIntensity?: MotionPressIntensity;
  /** 缩放方向 — 默认 `up`（放大）；`down` 为对称缩小。 */
  pressScaleDirection?: MotionPressScaleDirection;
  /** `glass` — `motion-glass-scale-press-*` + `glass-press`；与 `EgButtonGlass` RN 栈一致。 */
  pressRecipe?: MotionPressRecipe;
};

function resolveStaticStyle(
  style: EgEdsAnimaPressProps['style'],
  pressed: boolean,
): ViewStyle | undefined {
  const resolved = typeof style === 'function' ? style({ pressed }) : style;
  return StyleSheet.flatten(resolved) as ViewStyle | undefined;
}

export function EgEdsAnimaPress({
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
  pressScaleDirection = 'up',
  pressRecipe = 'tap',
}: EgEdsAnimaPressProps) {
  const { animatedStyle, onPressIn: scalePressIn, onPressOut: scalePressOut, pressing } =
    useMotionPressScale({ pressRecipe, pressIntensity, pressScaleDirection });

  const handlePressIn = () => {
    scalePressIn();
    onPressIn?.();
  };

  const handlePressOut = () => {
    scalePressOut();
    onPressOut?.();
  };

  const staticStyle = resolveStaticStyle(style, pressing);

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
      {typeof children === 'function' ? children({ pressed: pressing }) : children}
    </AnimatedPressable>
  );
}
