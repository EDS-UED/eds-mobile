import { useEffect, useRef } from 'react';
import { mobileTheme } from '../../theme/index.js';
import { Platform, StyleSheet, View, type ViewStyle } from 'react-native';
import { GlassHighlightLayers } from './GlassHighlightLayers.js';
import { useGlassBlurTargetRef } from './GlassBlurScope.js';
import {
  getNativeBlurView,
  nativeBlurIntensity,
  resolveAndroidBlurMethod,
} from './nativeBlur.js';
import {
  glassBackdropFilter,
  mixGlassBorderColor,
  mixGlassSurfaceColor,
  resolveGlassBorderRadius,
  resolveGlassFaceColor,
  resolveGlassVariant,
} from './resolveGlassSurfacePresets.js';
import type { GlassSurfaceProps } from './types.js';

const isWeb = Platform.OS === 'web';

export function GlassSurface({
  variant = 'regular',
  shape = 'medium',
  enhancedRefraction = true,
  mode = 'light',
  style,
  testID,
  children,
}: GlassSurfaceProps) {
  const hostRef = useRef<HTMLElement | null>(null);
  const preset = resolveGlassVariant(variant);
  const face = resolveGlassFaceColor(mode);
  const borderRadius = resolveGlassBorderRadius(shape);
  const stroke = mobileTheme.spacing['stroke-sm'] as number;
  const radiusStyle: ViewStyle =
    borderRadius === '50%' ? { borderRadius: 9999 } : { borderRadius };
  const BlurView = !isWeb ? getNativeBlurView() : null;
  const blurTargetRef = useGlassBlurTargetRef();
  const androidBlurMethod = resolveAndroidBlurMethod();
  const androidBlurActive =
    Platform.OS === 'android' && BlurView != null && blurTargetRef != null && androidBlurMethod !== 'none';
  const blurTint = mode === 'dark' ? 'dark' : 'light';

  useEffect(() => {
    if (!isWeb || !enhancedRefraction) return;

    const node = hostRef.current;
    if (!node) return;

    let cancelled = false;

    void import('@eds/mobile-tokens/liquid-glass').then(({ attachLiquidGlass, detachLiquidGlass }) => {
      if (cancelled) return;
      attachLiquidGlass(node);
      return () => detachLiquidGlass(node);
    });

    return () => {
      cancelled = true;
      void import('@eds/mobile-tokens/liquid-glass').then(({ detachLiquidGlass }) => {
        detachLiquidGlass(node);
      });
    };
  }, [enhancedRefraction, variant, shape, mode]);

  const surfaceStyle: ViewStyle = {
    borderColor: mixGlassBorderColor(face, preset.borderOpacity),
    borderWidth: stroke,
    overflow: 'hidden',
    ...radiusStyle,
    shadowColor: '#000000',
    shadowOpacity: preset.surfaceOpacity > 0.5 ? 0.12 : 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    backgroundColor: androidBlurActive
      ? mixGlassSurfaceColor(face, preset.surfaceOpacity * 0.22)
      : BlurView
        ? mixGlassSurfaceColor(face, preset.surfaceOpacity * 0.45)
        : mixGlassSurfaceColor(face, preset.surfaceOpacity),
  };

  const webBackdrop =
    isWeb && !enhancedRefraction
      ? ({
          backdropFilter: glassBackdropFilter(preset.blur, preset.saturation),
          WebkitBackdropFilter: glassBackdropFilter(preset.blur, preset.saturation),
        } as ViewStyle)
      : null;

  return (
    <View
      testID={testID}
      {...(enhancedRefraction ? ({ dataSet: { liquidGlassBox: '' } } as object) : {})}
      {...(isWeb
        ? {
            ref: (node: unknown) => {
              hostRef.current = node as HTMLElement | null;
            },
          }
        : {})}
      style={[styles.root, surfaceStyle, webBackdrop, style]}
    >
      {BlurView ? (
        <View pointerEvents="none" style={styles.blurLayer}>
          <BlurView
            intensity={nativeBlurIntensity(preset.blur)}
            tint={blurTint}
            style={StyleSheet.absoluteFill}
            blurTarget={blurTargetRef ?? undefined}
            blurMethod={Platform.OS === 'android' ? androidBlurMethod : undefined}
            blurReductionFactor={Platform.OS === 'android' ? 2 : undefined}
          />
        </View>
      ) : null}
      <GlassHighlightLayers mode={mode} variant={preset} borderRadius={borderRadius} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'relative',
  },
  blurLayer: {
    ...StyleSheet.absoluteFill,
    zIndex: 0,
  },
  content: {
    position: 'relative',
    zIndex: 2,
  },
});
