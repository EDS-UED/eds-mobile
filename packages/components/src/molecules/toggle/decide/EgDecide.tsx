import { useState } from 'react';
import { Pressable, StyleSheet, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { resolveColor } from '../../../shared/resolveColor.js';
import { getThemeColors, mobileTheme } from '../../../theme/index.js';
import type { EgCommonProps, ToggleSize } from '../../../shared/types.js';
import type { ThemeMode } from '../../../theme/index.js';
import { ToggleOvalTickMark } from '../_shared/ToggleOvalTickMark.js';
import { EG_TOGGLE_MARK_DEFAULT_SIZE, egToggleMarkComponentDefaults } from '../_shared/toggleComponentDefaults.js';
import { decideStyle } from '../_shared/toggleStyles.js';
import { useToggleMarkFadeMotion } from '../_shared/useToggleMarkFadeMotion.js';

export type EgDecideProps = EgCommonProps & {
  size?: ToggleSize;
  decided?: boolean;
  defaultDecided?: boolean;
  disabled?: boolean;
  onDecidedChange?: (decided: boolean) => void;
  style?: ViewStyle;
  mode?: ThemeMode;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function EgDecide({
  size = EG_TOGGLE_MARK_DEFAULT_SIZE,
  decided,
  defaultDecided = egToggleMarkComponentDefaults.defaultDecided,
  disabled = false,
  onDecidedChange,
  testID,
  mode = 'light',
  style,
  accessibilityLabel = 'Decide',
}: EgDecideProps) {
  const [uncontrolledDecided, setUncontrolledDecided] = useState(defaultDecided);
  const isDecided = decided !== undefined ? decided : uncontrolledDecided;
  const { markMounted, markAnimatedStyle, shellAnimatedStyle } = useToggleMarkFadeMotion(isDecided);

  const colors = getThemeColors(mode);
  const brand = resolveColor(colors, 'material-brand');
  const radius = mobileTheme.spacing['radius-sm'] as number;
  const stroke = mobileTheme.spacing['stroke-md'] as number;

  const toggle = () => {
    if (disabled) return;
    const next = !isDecided;
    if (decided === undefined) {
      setUncontrolledDecided(next);
    }
    onDecidedChange?.(next);
  };

  return (
    <AnimatedPressable
      testID={testID ?? 'toggle-decide'}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isDecided, disabled }}
      disabled={disabled}
      onPress={toggle}
      style={[decideStyle(mode, false, disabled, size), style]}
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