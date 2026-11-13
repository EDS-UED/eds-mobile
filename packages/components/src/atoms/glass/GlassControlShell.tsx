import type { ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, type ViewStyle } from 'react-native';
import { triggerGlassPressHaptic } from './glassPressHaptic.js';
import { GlassInteraction } from './GlassInteraction.js';
import { GlassSurface } from './GlassSurface.js';
import { getNativeGlassView } from './nativeLiquidGlass.js';
import { shouldUseIosNativeGlassMaterial } from './resolveNativeGlassEnhancement.js';
import { resolveGlassControlShellStyle } from './resolveGlassControlMetrics.js';
import type { GlassControlShellProps } from './types.js';

function NativeGlassControl(props: GlassControlShellProps) {
  const {
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
  } = props;
  const GlassView = getNativeGlassView();
  if (!GlassView) {
    return <FallbackGlassControl {...props} />;
  }

  const shellStyle = StyleSheet.flatten(
    shellLayout === 'component'
      ? [styles.nativeShell, style]
      : [resolveGlassControlShellStyle(shape), styles.nativeShell, style],
  ) as ViewStyle;
  const glassEffectStyle = variant === 'clear' ? 'clear' : 'regular';

  const hitStyle = [
    shape === 'circle' ? styles.circleHit : styles.pillHit,
    contentStyle,
    disabled ? styles.disabled : null,
  ];

  // GlassView 必须是触摸/几何最外层：`isInteractive` 的缩放由 UIKit 画在 GlassView 上。
  // 若 Pressable 包在外面、GlassView absoluteFill 在内，会看到「外壳不缩、只有里层亮」。
  return (
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
        style={hitStyle}
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
  pressIntensity,
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
      pressIntensity={pressIntensity}
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
  /** 勿 `overflow: 'hidden'` — 会裁切 `isInteractive` 按压形变。 */
  nativeShell: {
    overflow: 'visible',
  },
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
