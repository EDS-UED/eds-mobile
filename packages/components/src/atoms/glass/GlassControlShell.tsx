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
  shellLayout = 'toolbar',
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

  const shellStyle = StyleSheet.flatten(
    shellLayout === 'component'
      ? [style]
      : [resolveGlassControlShellStyle(shape), style],
  ) as ViewStyle;
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
  shellLayout = 'toolbar',
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
  const surfaceStyle = StyleSheet.flatten(
    shellLayout === 'component'
      ? [style, contentStyle]
      : [resolveGlassControlShellStyle(shape), contentStyle],
  ) as ViewStyle;

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
      style={shellLayout === 'component' ? undefined : style}
    >
      <GlassSurface
        variant={variant}
        shape={surfaceShape}
        mode={mode}
        enhancedRefraction
        style={surfaceStyle}
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
    shellLayout = 'toolbar',
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
        shellLayout={shellLayout}
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
      shellLayout={shellLayout}
      haptic={haptic}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  /** 胶囊 — 默认随内容；EgButtonGlass 双 icon 在 contentStyle 上 stretch + 固定高度。 */
  pillHit: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
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
