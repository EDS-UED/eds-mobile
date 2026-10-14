import { Platform, StyleSheet, View } from 'react-native';

import { getNativeLinearGradient } from './nativeLinearGradient.js';
import { formatRgba, parseHexColor } from './glassBoxColorUtils.js';
import { rnColorFromHex, rnGlassBoxInsetShadowClipStyle } from './glassBoxRnStyle.js';
import type { GlassBoxShadowLayer } from './resolveGlassBox.js';
const ANDROID_INSET_BOX_SHADOW_MIN_SDK = 29;

function androidApiLevel(): number {
  if (Platform.OS !== 'android') {
    return ANDROID_INSET_BOX_SHADOW_MIN_SDK;
  }
  const version = (Platform as unknown as { Version: number | string }).Version;
  return typeof version === 'number' ? version : Number.parseInt(String(version), 10) || 0;
}

type GlassBoxInsetHighlightOverlayProps = {
  shadows: GlassBoxShadowLayer[];
  borderRadius: number;
};

/**
 * Inset box-shadow 在 RN 上属于 View background，若与 fill/gradient 同层会被子节点盖住（Android 尤其明显）。
 * 单独叠在最上层，对齐 Figma 内层 Inner Shadow。
 */
export function GlassBoxInsetHighlightOverlay({
  shadows,
  borderRadius,
}: GlassBoxInsetHighlightOverlayProps) {
  const insetStyle = rnGlassBoxInsetShadowClipStyle(shadows);
  const insetLayer = shadows.find((layer) => layer.inset);
  const LinearGradient = getNativeLinearGradient();

  const needsGradientFallback =
    Platform.OS === 'android' &&
    androidApiLevel() < ANDROID_INSET_BOX_SHADOW_MIN_SDK &&
    insetLayer != null &&
    LinearGradient != null;

  if (!insetStyle.boxShadow && !needsGradientFallback) {
    return null;
  }

  if (needsGradientFallback && insetLayer) {
    const top = rnColorFromHex(insetLayer.color);
    const parsed = parseHexColor(insetLayer.color);
    const transparent = parsed ? formatRgba({ ...parsed, a: 0 }) : 'rgba(0,0,0,0)';
    return (
      <LinearGradient
        pointerEvents="none"
        colors={[top, transparent]}
        locations={[0, 0.45]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[styles.overlay, { borderRadius }]}
      />
    );
  }

  return (
    <View
      pointerEvents="none"
      style={[styles.overlay, { borderRadius }, insetStyle]}
    />
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'transparent',
    zIndex: 3,
    elevation: 3,
  },
});
