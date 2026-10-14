import {
  EgGlass,
  GlassBlurBackdrop,
  type EgGlassProps,
  type GlassBoxClassName,
} from '@eds/mobile-components';
import { Platform, StyleSheet, View } from 'react-native';

import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';
import type { EffectPreviewThemeMode } from '@/views/tokens/effectTokenPreviewStyle';
import { GlassBoxPreviewBackdropGradient } from '@/views/tokens/glassBoxPreviewBackdrop';
import {
  GLASS_BOX_PREVIEW_SIZE_PX,
  glassBoxPreviewRadiusStyle,
  glassBoxPreviewShadowBleed,
  glassBoxPreviewSizePx,
} from '@/views/tokens/glassBoxPreviewMetrics';
import { resolveGlassBoxPreviewComposition } from '@/views/tokens/glassBoxPreviewTypes';

type GlassBoxEffectPreviewProps = {
  className: GlassBoxClassName;
  mode: EffectPreviewThemeMode;
  colors: ShowcaseColorMap;
};

export function GlassBoxEffectPreview({ className, mode, colors }: GlassBoxEffectPreviewProps) {
  const previewSize = glassBoxPreviewSizePx();
  const shadowBleed = glassBoxPreviewShadowBleed(className, mode);
  const composition = resolveGlassBoxPreviewComposition(className, mode);
  const radiusStyle = glassBoxPreviewRadiusStyle(className, composition.borderRadius);
  const orb = <GlassBoxPreviewBackdropGradient colors={colors} />;

  const glassStyle = {
    ...radiusStyle,
    width: previewSize,
    height: previewSize,
    zIndex: 2,
  } satisfies EgGlassProps['style'];

  return (
    <View style={[styles.previewStack, { paddingBottom: shadowBleed }]}>
      {Platform.OS === 'android' ? (
        <GlassBlurBackdrop style={styles.panelHost}>{orb}</GlassBlurBackdrop>
      ) : (
        <View pointerEvents="none" style={styles.panelHost}>
          {orb}
        </View>
      )}
      <View style={[styles.glassPanelShell, { width: previewSize, height: previewSize }]}>
        <EgGlass box={className} mode={mode} style={glassStyle} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  previewStack: {
    position: 'relative',
    width: GLASS_BOX_PREVIEW_SIZE_PX,
    minHeight: GLASS_BOX_PREVIEW_SIZE_PX,
    alignSelf: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  panelHost: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: GLASS_BOX_PREVIEW_SIZE_PX,
    height: GLASS_BOX_PREVIEW_SIZE_PX,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  glassPanelShell: {
    zIndex: 2,
    overflow: 'visible',
  },
});
