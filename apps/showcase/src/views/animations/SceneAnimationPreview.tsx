import {
  EgDoneTick,
  EgMotionProcessing,
  EgMnemonicVerify,
  EgOdometer,
  EgRipplePulse,
  EgVerifyRingDots,
  VERIFY_RING_DEFAULT_SIZE,
} from '@eds/mobile-animations';
import { EgSymbol } from '@eds/mobile-components';
import { mobileTheme } from '@eds/mobile-tokens/theme';
import { useMemo } from 'react';
import { StyleSheet, View, type TextStyle } from 'react-native';
import { edsFontStyle } from '@/lib/edsFontFamily';
import { edsSmoothRadius, edsTypographyRole } from '@/views/shared/resolveEdsTheme';

import type { SceneAnimationCustomizeState } from '@/data/animations/sceneAnimationCustomize';
import type { SceneAnimationSlug } from '@/data/animations/sceneAnimationCatalog';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { useShowcaseThemeContext } from '@/theme/ShowcaseThemeProvider';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

const ODOMETER_DEMO_VALUE = '$ 8,000.23';

type SceneAnimationPreviewProps = {
  slug: SceneAnimationSlug;
  customize: SceneAnimationCustomizeState;
  /** EgOdometer 重播 intro。 */
  odometerReplayKey?: number;
};

function resolveToneColor(
  customize: SceneAnimationCustomizeState,
  colors: ReturnType<typeof useShowcaseColors>,
) {
  if (customize.tone === 'success') {
    return colors['status-success'] as string;
  }
  if (customize.tone === 'warning') {
    return colors['status-warning'] as string;
  }
  return colors['material-brand'] as string;
}

export function SceneAnimationPreview({
  slug,
  customize,
  odometerReplayKey = 0,
}: SceneAnimationPreviewProps) {
  const colors = useShowcaseColors();
  const { colorTheme: mode } = useShowcaseThemeContext();
  const toneColor = resolveToneColor(customize, colors);
  const brandPrimary = colors['material-brand'] as string;
  const brandTertiary = (colors['text-base-tertiary'] ?? colors['material-brand-weaken']) as string;

  const odometerTextStyle = useMemo<TextStyle>(
    () => ({
      ...edsTypographyRole('display'),
      ...edsFontStyle('700'),
      color: colors['material-base-primary'] as string,
    }),
    [colors],
  );

  const ringInnerStyle = useMemo(
    () => [
      styles.ringInner,
      edsSmoothRadius('radius-full'),
      {
        backgroundColor: colors['material-brand-weaken'] as string,
      },
    ],
    [colors],
  );

  if (slug === 'verification-ring-dots') {
    return (
      <View style={styles.stage}>
        <View style={styles.ringHost}>
          <EgVerifyRingDots
            active={customize.active}
            ringSize={VERIFY_RING_DEFAULT_SIZE}
            color={brandPrimary}
            idleColor={brandTertiary}
            style={StyleSheet.absoluteFill}
          />
          <View style={ringInnerStyle}>
            <EgSymbol name="eds-key-fill" size="sm" mode={mode} strokeColorToken="text-brand" />
          </View>
        </View>
      </View>
    );
  }

  if (slug === 'business-success') {
    return (
      <View style={styles.stage}>
        <EgDoneTick color={toneColor} key={`done-${toneColor}`} />
      </View>
    );
  }

  if (slug === 'business-processing') {
    return (
      <View style={styles.stage}>
        <EgMotionProcessing active={customize.active} color={toneColor} />
      </View>
    );
  }

  if (slug === 'mnemonic-verification') {
    return (
      <View style={styles.stage}>
        <EgMnemonicVerify active={customize.active} color={toneColor} />
      </View>
    );
  }

  if (slug === 'odometer') {
    return (
      <View style={styles.stage}>
        <EgOdometer
          key={odometerReplayKey}
          value={ODOMETER_DEMO_VALUE}
          animateIntro={customize.active}
          textStyle={odometerTextStyle}
          style={styles.odometerPreview}
        />
      </View>
    );
  }

  return (
    <View style={styles.stage}>
      <EgRipplePulse active={customize.active} color={toneColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    minHeight: 240,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  ringHost: {
    width: VERIFY_RING_DEFAULT_SIZE,
    height: VERIFY_RING_DEFAULT_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringInner: {
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: mobileTheme.spacing['spacing-4'] as number,
  },
  odometerPreview: {
    alignSelf: 'center',
  },
});