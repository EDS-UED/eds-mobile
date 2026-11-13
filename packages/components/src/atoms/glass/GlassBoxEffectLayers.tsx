import { Platform, StyleSheet, View } from 'react-native';

import {
  getNativeBlurView,
  nativeBlurIntensity,
  resolveAndroidBlurMethod,
} from './nativeBlur.js';
import { getNativeLinearGradient } from './nativeLinearGradient.js';
import { useGlassBlurTargetRef } from './GlassBlurScope.js';
import { rnColorFromHex } from './glassBoxRnStyle.js';
import type { GlassBoxComposition } from './resolveGlassBox.js';
import type { ThemeMode } from '../../theme/index.js';
import { getThemeColors } from '../../theme/index.js';

type GlassBoxEffectLayersProps = {
  mode: ThemeMode;
  composition: GlassBoxComposition;
};

function backdropBlurIntensity(composition: GlassBoxComposition) {
  const fromBox = composition.backdropBlur?.nativeIntensity;
  if (fromBox != null) {
    return fromBox;
  }
  const blurPx = composition.backdropBlur?.radiusPx;
  if (blurPx != null) {
    return nativeBlurIntensity(blurPx);
  }
  return nativeBlurIntensity(8);
}

/** CSS 0deg：自下而上 overlay stops，叠在 effect-box 之上（Figma Glass Box）。 */
const OVERLAY_GRADIENT_START = { x: 0.5, y: 1 } as const;
const OVERLAY_GRADIENT_END = { x: 0.5, y: 0 } as const;

function resolveOverlayGradient(
  composition: GlassBoxComposition,
): { colors: string[]; locations: number[] } | null {
  const gradientLayer = composition.layers.find((layer) => layer.kind === 'overlayGradient');
  if (gradientLayer?.kind !== 'overlayGradient' || gradientLayer.stops.length < 2) {
    return null;
  }
  return {
    colors: gradientLayer.stops.map((stop) => rnColorFromHex(stop.color)),
    locations: gradientLayer.stops.map((stop) => stop.position),
  };
}

export function GlassBoxEffectLayers({ mode, composition }: GlassBoxEffectLayersProps) {
  const colors = getThemeColors(mode);
  const fillLayer = composition.layers.find((layer) => layer.kind === 'fill');
  const overlay = resolveOverlayGradient(composition);

  const fillColor =
    fillLayer?.kind === 'fill'
      ? rnColorFromHex(fillLayer.color)
      : overlay
        ? 'transparent'
        : rnColorFromHex(colors['effect-box'] as string);

  const blurTargetRef = useGlassBlurTargetRef();
  const BlurView = getNativeBlurView();
  const LinearGradient = getNativeLinearGradient();
  const useBackdropBlur = composition.backdropBlur != null;
  const blurTint: 'light' | 'dark' = mode === 'dark' ? 'dark' : 'light';
  const blurIntensity = backdropBlurIntensity(composition);
  const androidBlurMethod = resolveAndroidBlurMethod();
  const iosBlur = Platform.OS === 'ios';

  const fillLayerView = <View style={[styles.boxFill, { backgroundColor: fillColor }]} />;

  const blurProps = {
    intensity: blurIntensity,
    tint: blurTint,
    blurTarget: iosBlur ? undefined : (blurTargetRef ?? undefined),
    blurMethod: Platform.OS === 'android' ? (blurTargetRef ? androidBlurMethod : 'none') : undefined,
    blurReductionFactor: Platform.OS === 'android' ? 2 : undefined,
  };

  return (
    <>
      {BlurView && useBackdropBlur ? (
        <BlurView
          key={Platform.OS === 'android' ? (blurTargetRef ? 'android-blur-target' : 'android-blur-idle') : 'ios-blur'}
          style={styles.blurBackdrop}
          {...blurProps}
        >
          {fillLayerView}
        </BlurView>
      ) : (
        fillLayerView
      )}
      {LinearGradient && overlay ? (
        <LinearGradient
          pointerEvents="none"
          colors={overlay.colors as [string, string, ...string[]]}
          locations={overlay.locations as [number, number, ...number[]]}
          start={OVERLAY_GRADIENT_START}
          end={OVERLAY_GRADIENT_END}
          style={[StyleSheet.absoluteFill, styles.layerOverlay]}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  blurBackdrop: {
    ...StyleSheet.absoluteFill,
    zIndex: 0,
  },
  boxFill: {
    width: '100%',
    height: '100%',
  },
  layerOverlay: {
    zIndex: 2,
    elevation: 2,
  },
});
