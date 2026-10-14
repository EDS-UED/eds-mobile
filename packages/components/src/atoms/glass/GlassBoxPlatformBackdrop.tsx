import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

function mergeBackdropStyle(style?: StyleProp<ViewStyle>): ViewStyle {
  return StyleSheet.flatten([styles.fill, style]) ?? styles.fill;
}

import { GlassNativePlatformBoundary } from './GlassNativePlatformBoundary.js';
import { getAndroidLiquidGlassView } from './nativeAndroidLiquidGlass.js';
import { getNativeGlassView } from './nativeLiquidGlass.js';
import {
  shouldUseAndroidNativeGlassMaterial,
  shouldUseIosNativeGlassMaterial,
} from './resolveNativeGlassEnhancement.js';
import type { ThemeMode } from '../../theme/index.js';

type GlassBoxPlatformBackdropProps = {
  mode: ThemeMode;
  borderRadius: number;
  /** 与 shell 同圆角；勿包在 overflow:hidden 内（iOS GlassView 会闪退）。 */
  style?: StyleProp<ViewStyle>;
};

function IosGlassBackdrop({
  mode,
  style,
}: {
  mode: ThemeMode;
  style?: StyleProp<ViewStyle>;
}) {
  if (!shouldUseIosNativeGlassMaterial()) {
    return null;
  }

  const GlassView = getNativeGlassView();
  if (!GlassView) {
    return null;
  }

  const colorScheme = mode === 'dark' ? 'dark' : 'light';

  return (
    <GlassView
      pointerEvents="none"
      glassEffectStyle="regular"
      colorScheme={colorScheme}
      style={mergeBackdropStyle(style)}
    />
  );
}

function AndroidGlassBackdrop({
  borderRadius,
  style,
}: {
  borderRadius: number;
  style?: StyleProp<ViewStyle>;
}) {
  if (!shouldUseAndroidNativeGlassMaterial()) {
    return null;
  }

  const AndroidGlass = getAndroidLiquidGlassView();
  if (!AndroidGlass) {
    return null;
  }

  const safeRadius = Number.isFinite(borderRadius) && borderRadius > 0 ? borderRadius : 0;

  return (
    <View pointerEvents="none" style={mergeBackdropStyle(style)}>
      <AndroidGlass cornerRadius={safeRadius} style={StyleSheet.absoluteFill} />
    </View>
  );
}

/** 平台透镜层 — 与 Effect 叠层同栈；不可用或原生异常时静默省略。 */
export function GlassBoxPlatformBackdrop({ mode, borderRadius, style }: GlassBoxPlatformBackdropProps) {
  return (
    <GlassNativePlatformBoundary>
      {Platform.OS === 'ios' ? (
        <IosGlassBackdrop mode={mode} style={style} />
      ) : Platform.OS === 'android' ? (
        <AndroidGlassBackdrop borderRadius={borderRadius} style={style} />
      ) : null}
    </GlassNativePlatformBoundary>
  );
}

const styles = StyleSheet.create({
  fill: {
    ...StyleSheet.absoluteFill,
    zIndex: 0,
  },
});
