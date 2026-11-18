import { useState } from 'react';
import { Pressable, StyleSheet, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { resolveColor } from '../../../shared/resolveColor.js';
import { getThemeColors, mobileTheme } from '../../../theme/index.js';
import type { EgCommonProps, ToggleSize } from '../../../shared/types.js';
import type { ThemeMode } from '../../../theme/index.js';
import { ToggleOvalTickMark } from '../_shared/ToggleOvalTickMark.js';
import { EG_TOGGLE_MARK_DEFAULT_SIZE, egToggleMarkComponentDefaults } from '../_shared/toggleComponentDefaults.js';
import { checkboxStyle } from '../_shared/toggleStyles.js';
import { useToggleMarkFadeMotion } from '../_shared/useToggleMarkFadeMotion.js';

export type EgCheckboxProps = EgCommonProps & {
  size?: ToggleSize;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  style?: ViewStyle;
  mode?: ThemeMode;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function EgCheckbox({
  size = EG_TOGGLE_MARK_DEFAULT_SIZE,
  checked,
  defaultChecked = egToggleMarkComponentDefaults.defaultChecked,
  disabled = false,
  onCheckedChange,
  testID,
  mode = 'light',
  style,
  accessibilityLabel = 'Checkbox',
}: EgCheckboxProps) {
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked);
  const isChecked = checked !== undefined ? checked : uncontrolledChecked;
  const { markMounted, markAnimatedStyle, shellAnimatedStyle } = useToggleMarkFadeMotion(isChecked);

  const colors = getThemeColors(mode);
  const brand = resolveColor(colors, 'material-brand');
  const radius = mobileTheme.spacing['radius-xs'] as number;
  const stroke = mobileTheme.spacing['stroke-md'] as number;

  const toggle = () => {
    if (disabled) return;
    const next = !isChecked;
    if (checked === undefined) {
      setUncontrolledChecked(next);
    }
    onCheckedChange?.(next);
  };

  return (
    <AnimatedPressable
      testID={testID ?? 'toggle-checkbox'}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isChecked, disabled }}
      disabled={disabled}
      onPress={toggle}
      style={[checkboxStyle(mode, false, disabled, size), style]}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: brand, borderRadius: radius },
          shellAnimatedStyle,
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { borderWidth: stroke, borderColor: brand, borderRadius: radius },
          shellAnimatedStyle,
        ]}
      />
      {markMounted ? (
        <Animated.View style={markAnimatedStyle}>
          <ToggleOvalTickMark mode={mode} />
        </Animated.View>
      ) : null}
    </AnimatedPressable>
  );
}