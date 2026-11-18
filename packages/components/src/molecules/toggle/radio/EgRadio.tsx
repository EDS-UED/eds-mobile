import { useState } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { resolveColor } from '../../../shared/resolveColor.js';
import { getThemeColors, mobileTheme } from '../../../theme/index.js';
import type { EgCommonProps, ToggleSize } from '../../../shared/types.js';
import type { ThemeMode } from '../../../theme/index.js';
import { radioSize } from '../../../shared/controlMetrics.js';
import { EG_TOGGLE_MARK_DEFAULT_SIZE, egToggleMarkComponentDefaults } from '../_shared/toggleComponentDefaults.js';
import { radioDotStyle, radioStyle } from '../_shared/toggleStyles.js';
import { useToggleMarkFadeMotion } from '../_shared/useToggleMarkFadeMotion.js';

export type EgRadioProps = EgCommonProps & {
  size?: ToggleSize;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  style?: ViewStyle;
  mode?: ThemeMode;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function EgRadio({
  size = EG_TOGGLE_MARK_DEFAULT_SIZE,
  checked,
  defaultChecked = egToggleMarkComponentDefaults.defaultChecked,
  disabled = false,
  onCheckedChange,
  testID,
  mode = 'light',
  style,
  accessibilityLabel = 'Radio',
}: EgRadioProps) {
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked);
  const isChecked = checked !== undefined ? checked : uncontrolledChecked;
  const { markMounted, markAnimatedStyle, shellAnimatedStyle } = useToggleMarkFadeMotion(isChecked);
  const dotStyle = radioDotStyle(mode, size);

  const colors = getThemeColors(mode);
  const brand = resolveColor(colors, 'material-brand');
  const radius = radioSize(size) / 2;
  const stroke = mobileTheme.spacing['stroke-lg'] as number;

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
      testID={testID ?? 'toggle-radio'}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="radio"
      accessibilityState={{ checked: isChecked, disabled }}
      disabled={disabled}
      onPress={toggle}
      style={[radioStyle(mode, false, disabled, size), style]}
    >
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
          <View style={dotStyle} />
        </Animated.View>
      ) : null}
    </AnimatedPressable>
  );
}