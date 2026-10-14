import { useEffect } from 'react';
import { Pressable, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { resolveMotionRecipe } from '@eds/mobile-animations';
import type { EgCommonProps, ToggleSize } from '../../../shared/types.js';
import type { ThemeMode } from '../../../theme/index.js';
import { switchThumbStyle, switchTrackStyle } from '../_shared/toggleStyles.js';

export type EgSwitchProps = EgCommonProps & {
  size?: ToggleSize;
  value?: boolean;
  defaultValue?: boolean;
  disabled?: boolean;
  onValueChange?: (value: boolean) => void;
  style?: ViewStyle;
  mode?: ThemeMode;
};

const controlMotion = resolveMotionRecipe('control');

export function EgSwitch({
  size = 'md',
  value,
  defaultValue = false,
  disabled = false,
  onValueChange,
  testID,
  mode = 'light',
  style,
  accessibilityLabel = 'Switch',
}: EgSwitchProps) {
  const on = value ?? defaultValue;
  const offset = useSharedValue(on ? 1 : 0);

  useEffect(() => {
    offset.value = withSpring(on ? 1 : 0, controlMotion.springConfig);
  }, [on, offset]);

  const thumbAnimated = useAnimatedStyle(
    () => ({
      alignSelf: offset.value > 0.5 ? ('flex-end' as const) : ('flex-start' as const),
    }),
    [offset],
  );

  const toggle = () => {
    if (disabled) return;
    const next = !on;
    offset.value = withSpring(next ? 1 : 0, controlMotion.springConfig);
    onValueChange?.(next);
  };

  return (
    <Pressable
      testID={testID ?? 'toggle-switch'}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="switch"
      accessibilityState={{ checked: on, disabled }}
      disabled={disabled}
      onPress={toggle}
      style={[switchTrackStyle(mode, size, on, disabled), style]}
    >
      <Animated.View style={[switchThumbStyle(mode, size), thumbAnimated]} />
    </Pressable>
  );
}
