import { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { EdsRecipeAnima } from '@eds/mobile-animations';

import {
  switchThumbStyle,
  switchThumbTravel,
  switchTrackStyle,
} from '../_shared/toggleStyles.js';
import { EG_SWITCH_DEFAULT_SIZE, EG_SWITCH_DEFAULT_VALUE } from '../_shared/toggleComponentDefaults.js';
import type { EgSwitchProps } from './EgSwitch.types.js';

const controlMotion = EdsRecipeAnima('slide');

/** Android · iOS ≤25 — token 轨道 + slide 弹簧。 */
export function EgSwitchRn({
  size = EG_SWITCH_DEFAULT_SIZE,
  value,
  defaultValue = EG_SWITCH_DEFAULT_VALUE,
  disabled = false,
  onValueChange,
  testID,
  mode = 'light',
  style,
  accessibilityLabel = 'Switch',
}: EgSwitchProps) {
  const [uncontrolledOn, setUncontrolledOn] = useState(defaultValue);
  const on = value ?? uncontrolledOn;
  const travel = switchThumbTravel(size);
  const offset = useSharedValue(on ? travel : 0);

  useEffect(() => {
    offset.value = withSpring(on ? travel : 0, controlMotion.springConfig);
  }, [on, offset, travel]);

  const thumbAnimated = useAnimatedStyle(
    () => ({
      transform: [{ translateX: offset.value }],
    }),
    [offset],
  );

  const toggle = () => {
    if (disabled) return;
    const next = !on;
    offset.value = withSpring(next ? travel : 0, controlMotion.springConfig);
    if (value === undefined) {
      setUncontrolledOn(next);
    }
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