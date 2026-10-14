import { GlassBlurScope } from '@eds/mobile-components';
import { StyleSheet, View, useColorScheme } from 'react-native';
import { BlurView } from 'expo-blur';
import mobileTheme from '@eds/mobile-tokens/theme';

import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';
import type { TokenEntry } from '@/data/tokens/tokenCatalogTypes';
import { resolveColorTheme } from '@/data/tokens/colorTokenCatalog';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

import { GlassBoxEffectPreview } from '@/views/tokens/GlassBoxEffectPreview';
import { GLASS_BOX_PREVIEW_SIZE_PX } from '@/views/tokens/glassBoxPreviewMetrics';
import {
  EFFECT_PREVIEW_DIAMETER,
  isGlassBoxPreviewClass,
  resolveEffectPreviewModel,
  type EffectPreviewThemeMode,
} from './effectTokenPreviewStyle';

type EffectTokenPreviewProps = {
  entry: TokenEntry;
  colors: ShowcaseColorMap;
};

export function EffectTokenPreview({ entry, colors }: EffectTokenPreviewProps) {
  const scheme = useColorScheme();
  const mode: EffectPreviewThemeMode = resolveColorTheme(scheme);

  if (isGlassBoxPreviewClass(entry.name)) {
    return (
      <View style={styles.stageWrap}>
        <GlassBlurScope>
          <View style={[styles.glassStage, styles.glassStageBare]}>
            <GlassBoxEffectPreview className={entry.name} mode={mode} colors={colors} />
          </View>
        </GlassBlurScope>
      </View>
    );
  }

  const model = resolveEffectPreviewModel(entry, mode, colors);
  const blurTint = mode === 'dark' ? 'dark' : 'light';
  const needsBackdrop = model.blurIntensity != null;

  return (
    <View style={styles.stageWrap}>
      <View style={[styles.stage, theme.blockRadius, { backgroundColor: colors['material-match-weaken'] as string }]}>
        <View
          style={[
            styles.backdropOrb,
            styles.backdropOrbPrimary,
            { backgroundColor: colors['material-brand'] as string },
          ]}
        />
        <View
          style={[
            styles.backdropOrb,
            styles.backdropOrbSecondary,
            { backgroundColor: colors['material-match'] as string },
          ]}
        />
        <View style={[styles.circle, model.circleStyle]}>
          {needsBackdrop ? (
            <BlurView intensity={model.blurIntensity} tint={blurTint} style={StyleSheet.absoluteFill} />
          ) : null}
          {model.overlay ? (
            <>
              <View
                style={[styles.overlayHalf, styles.overlayTop, { backgroundColor: model.overlay.topColor }]}
              />
              <View
                style={[
                  styles.overlayHalf,
                  styles.overlayBottom,
                  { backgroundColor: model.overlay.bottomColor },
                ]}
              />
            </>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stageWrap: {
    width: '100%',
    alignItems: 'center',
    overflow: 'visible',
  },
  stage: {
    width: '100%',
    maxWidth: 280,
    height: 176,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glassStage: {
    overflow: 'visible',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 360,
  },
  glassStageBare: {
    backgroundColor: 'transparent',
  },
  backdropOrb: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.85,
  },
  backdropOrbPrimary: {
    width: GLASS_BOX_PREVIEW_SIZE_PX + 24,
    height: GLASS_BOX_PREVIEW_SIZE_PX + 24,
    top: '18%',
    left: '8%',
  },
  backdropOrbSecondary: {
    width: GLASS_BOX_PREVIEW_SIZE_PX + 24,
    height: GLASS_BOX_PREVIEW_SIZE_PX + 24,
    top: '22%',
    right: '6%',
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayHalf: {
    ...StyleSheet.absoluteFill,
  },
  overlayTop: {
    bottom: EFFECT_PREVIEW_DIAMETER / 2,
  },
  overlayBottom: {
    top: EFFECT_PREVIEW_DIAMETER / 2,
  },
});
