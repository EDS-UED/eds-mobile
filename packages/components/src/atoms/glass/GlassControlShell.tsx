import type { ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { triggerGlassPressHaptic } from './glassPressHaptic.js';
import { GlassInteraction } from './GlassInteraction.js';
import { GlassSurface } from './GlassSurface.js';
import { getNativeGlassView } from './nativeLiquidGlass.js';
import { shouldUseIosNativeGlassMaterial } from './resolveNativeGlassEnhancement.js';
import { resolveGlassControlShellStyle } from './resolveGlassControlMetrics.js';
import type { GlassControlShellProps } from './types.js';

function NativeGlassControl({
  mode,
  variant,
  shape,
  disabled,
  onPress,
  onPressIn,
  onPressOut,
  testID,
  accessibilityLabel,
  haptic = true,
  style,
  contentStyle,
  children,
}: GlassControlShellProps) {
  const GlassView = getNativeGlassView();
  if (!GlassView) return null;

  const shellStyle = StyleSheet.flatten([resolveGlassControlShellStyle(shape), style]) as ViewStyle;
  const glassEffectStyle = variant === 'clear' ? 'clear' : 'regular';

  return (
    // Press feedback is UIKit's interactive glass (scale / shimmer); no RN opacity layered on top.
    <GlassView
      isInteractive
      glassEffectStyle={glassEffectStyle}
      colorScheme={mode === 'dark' ? 'dark' : 'light'}
      style={shellStyle}
    >
      <Pressable
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        disabled={disabled}
        onPress={onPress}
        onPressIn={() => {
          if (haptic) triggerGlassPressHaptic();
          onPressIn?.();
        }}
        onPressOut={onPressOut}
        style={[
          shape === 'circle' ? styles.circleHit : styles.pillHit,
          contentStyle,
          disabled ? styles.disabled : null,
        ]}
      >
        {children}
      </Pressable>
    </GlassView>
  );
}

function FallbackGlassControl({
  mode,
  variant,
  shape,
  disabled,
  onPress,
  onPressIn,
  onPressOut,
  testID,
  accessibilityLabel,
  haptic,
  style,
  contentStyle,
  children,
}: GlassControlShellProps) {
  const surfaceShape = shape === 'circle' ? 'circle' : 'capsule';

  return (
    <GlassInteraction
      press
      haptic={haptic}
      disabled={disabled}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      style={style}
    >
      <GlassSurface
        variant={variant}
        shape={surfaceShape}
        mode={mode}
        enhancedRefraction
        style={StyleSheet.flatten([resolveGlassControlShellStyle(shape), contentStyle]) as ViewStyle}
      >
        {children as ReactNode}
      </GlassSurface>
    </GlassInteraction>
  );
}

/** iOS-style frosted control — Liquid Glass on iOS 26+, blur + glass-press fallback elsewhere. */
export function GlassControlShell(props: GlassControlShellProps) {
  const {
    mode = 'light',
    variant = 'regular',
    shape,
    haptic = true,
    ...rest
  } = props;

  const useNative = Platform.OS === 'ios' && shouldUseIosNativeGlassMaterial() && Boolean(getNativeGlassView());

  if (useNative) {
    return (
      <NativeGlassControl
        mode={mode}
        variant={variant}
        shape={shape}
        haptic={haptic}
        {...rest}
      />
    );
  }

  return (
    <FallbackGlassControl
      mode={mode}
      variant={variant}
      shape={shape}
      haptic={haptic}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  pillHit: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleHit: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.45,
  },
});
