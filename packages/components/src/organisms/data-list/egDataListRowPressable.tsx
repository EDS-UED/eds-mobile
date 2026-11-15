import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Pressable as GesturePressable } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { triggerGlassPressHaptic } from '../../atoms/glass/glassPressHaptic.js';
import type { MotionPressIntensity } from '../../shared/themeScalars.js';
import { useMotionPressScale } from '../../shared/useMotionPressScale.js';

const AnimatedGesturePressable = Animated.createAnimatedComponent(GesturePressable);

type EgDataListRowPressableProps = {
  children: ReactNode | ((state: { pressed: boolean }) => ReactNode);
  disabled?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  /** iOS 压感 / 3D Touch · 默认关；开时较短 `delayLongPress` + 重触觉（真 3D Touch 须原生增强）。 */
  forceTouchEnabled?: boolean;
  onForcePress?: () => void;
  style?: StyleProp<ViewStyle> | ((state: { pressed: boolean }) => StyleProp<ViewStyle>);
  testID?: string;
  accessibilityLabel?: string;
  pressIntensity?: MotionPressIntensity;
};

function resolveStyle(
  style: EgDataListRowPressableProps['style'],
  pressed: boolean,
): ViewStyle | undefined {
  const resolved = typeof style === 'function' ? style({ pressed }) : style;
  return StyleSheet.flatten(resolved) as ViewStyle | undefined;
}

/**
 * 列表行点按 — RNGH Pressable：父级 Scroll 滑动 / 轻扫时不触发按压高亮与缩放（与 RN 原生 Pressable 区分）。
 * 仅 Tap / Long Press（及可选 Force）走 `pressing` 反馈。
 */
export function EgDataListRowPressable({
  children,
  disabled,
  onPress,
  onLongPress,
  forceTouchEnabled = false,
  onForcePress,
  style,
  testID,
  accessibilityLabel,
  pressIntensity = 'xs',
}: EgDataListRowPressableProps) {
  const { animatedStyle, onPressIn, onPressOut, pressing } = useMotionPressScale({
    pressRecipe: 'tap',
    pressIntensity,
    pressScaleDirection: 'down',
    enabled: true,
  });

  const handleLongPress = () => {
    onLongPress?.();
  };

  const handleForcePress = () => {
    triggerGlassPressHaptic();
    onForcePress?.();
  };

  const longPressHandler =
    forceTouchEnabled && onForcePress
      ? handleForcePress
      : onLongPress
        ? handleLongPress
        : undefined;

  const longPressDelay =
    forceTouchEnabled && onForcePress ? 320 : onLongPress ? 500 : undefined;

  return (
    <AnimatedGesturePressable
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      onLongPress={longPressHandler}
      delayLongPress={longPressHandler ? longPressDelay : undefined}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[resolveStyle(style, pressing), animatedStyle]}
    >
      {typeof children === 'function' ? children({ pressed: pressing }) : children}
    </AnimatedGesturePressable>
  );
}