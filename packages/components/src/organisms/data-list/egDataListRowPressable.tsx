import type { ReactNode } from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { triggerGlassPressHaptic } from '../../atoms/glass/glassPressHaptic.js';
import type { MotionPressIntensity } from '../../shared/themeScalars.js';
import { useMotionPressScale } from '../../shared/useMotionPressScale.js';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** 按下态延迟 — 期间父级 Scroll 接管（Swipe）则不进入按下态；快速点按松手时仍补一次反馈。 */
const ROW_PRESS_IN_DELAY_MS = 130;

type EgDataListRowPressableProps = {
  children: ReactNode | ((state: { pressed: boolean }) => ReactNode);
  disabled?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle> | ((state: { pressed: boolean }) => StyleProp<ViewStyle>);
  testID?: string;
  accessibilityLabel?: string;
  pressIntensity?: MotionPressIntensity;
  pressHapticEnabled?: boolean;
  touchGestureEnabled?: boolean;
};

function resolveStyle(
  style: EgDataListRowPressableProps['style'],
  pressed: boolean,
): ViewStyle | undefined {
  const resolved = typeof style === 'function' ? style({ pressed }) : style;
  return StyleSheet.flatten(resolved) as ViewStyle | undefined;
}

/**
 * 列表行点按 — RN Pressable（走 ScrollView 响应者链）：
 * - 轻扫 / 滑动 Swipe：按下态延迟 {@link ROW_PRESS_IN_DELAY_MS}，父级 Scroll 接管即取消，不出高亮与缩放；
 * - 快速滑动 Fling 惯性中点停：ScrollView 捕获触摸，行不触发 press / 高亮。
 * 仅 Tap / Long Press 走 `pressing` 反馈。
 */
export function EgDataListRowPressable({
  children,
  disabled,
  onPress,
  onLongPress,
  style,
  testID,
  accessibilityLabel,
  pressIntensity = 'xs',
  pressHapticEnabled = false,
  touchGestureEnabled = false,
}: EgDataListRowPressableProps) {
  const { animatedStyle, onPressIn, onPressOut, pressing } = useMotionPressScale({
    pressRecipe: 'tap',
    pressIntensity,
    pressScaleDirection: 'down',
    enabled: true,
  });

  const handlePress = () => {
    if (pressHapticEnabled) {
      triggerGlassPressHaptic();
    }
    onPress?.();
  };

  const longPressHandler = touchGestureEnabled && onLongPress ? onLongPress : undefined;

  return (
    <AnimatedPressable
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress ? handlePress : undefined}
      onLongPress={longPressHandler}
      delayLongPress={longPressHandler ? 500 : undefined}
      unstable_pressDelay={ROW_PRESS_IN_DELAY_MS}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[resolveStyle(style, pressing), animatedStyle]}
    >
      {typeof children === 'function' ? children({ pressed: pressing }) : children}
    </AnimatedPressable>
  );
}