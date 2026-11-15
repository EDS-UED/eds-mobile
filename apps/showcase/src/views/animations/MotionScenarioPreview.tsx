import { EgMenu, EgEdsAnimaPress } from '@eds/mobile-components';
import { PageShotDemo, SlideSelectionDemo } from '@eds/mobile-components/preview/motion';
import { LayoutContentTabDemo } from '@eds/mobile-components/preview/layout-content';
import mobileTheme from '@eds/mobile-tokens/theme';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { MotionScenarioId } from '@/data/animations/motionScenarioCustomize';
import {
  pageDirectionOf,
  type MotionScenarioCustomizeState,
} from '@/data/animations/motionScenarioCustomize';
import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';
import { ShowcaseSheetsPreview } from '@/views/components/ShowcaseSheetsPreview';
import { ShowcasePageNavigationDemo } from '@/views/animations/ShowcasePageNavigationDemo';
import { edsTokenFont } from '@/views/shared/resolveEdsTheme';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

type MotionScenarioPreviewProps = {
  scenario: MotionScenarioId;
  colors: ShowcaseColorMap;
  customize: MotionScenarioCustomizeState;
};

function PressPreview({
  colors,
  pressIntensity,
  pressScaleDirection,
}: {
  colors: ShowcaseColorMap;
  pressIntensity: MotionScenarioCustomizeState['pressIntensity'];
  pressScaleDirection: MotionScenarioCustomizeState['pressScaleDirection'];
}) {
  const [count, setCount] = useState(0);
  const scaleKey =
    pressScaleDirection === 'down'
      ? (`scale-press-down-${pressIntensity}` as const)
      : (`scale-press-${pressIntensity}` as const);
  const scaleValue =
    (mobileTheme.motion.scale[scaleKey] as number | undefined) ??
    (mobileTheme.motion.scale[
      pressScaleDirection === 'down' ? 'scale-press-down-sm' : 'scale-press-sm'
    ] as number);

  return (
    <View style={styles.previewBlock}>
      <EgEdsAnimaPress
        pressIntensity={pressIntensity}
        pressScaleDirection={pressScaleDirection}
        onPress={() => setCount((value) => value + 1)}
        style={[styles.tapButton, { backgroundColor: colors.brand as string }]}
      >
        <Text style={[styles.tapLabel, { color: colors['text-same-white'] as string }]}>
          Press · {scaleValue} · {count}
        </Text>
      </EgEdsAnimaPress>
    </View>
  );
}

export function MotionScenarioPreview({ scenario, colors, customize }: MotionScenarioPreviewProps) {
  switch (scenario) {
    case 'slide':
      return (
        <View style={styles.previewBlock}>
          <SlideSelectionDemo
            mode="light"
            pressScale={customize.slidePressScale}
            followDrag={customize.slideFollowDrag}
          />
        </View>
      );
    case 'sheets':
      return (
        <View style={styles.previewBlock}>
          <ShowcaseSheetsPreview mode="light" />
        </View>
      );
    case 'page':
      return (
        <View style={styles.previewBlock}>
          <ShowcasePageNavigationDemo
            direction={pageDirectionOf(customize)}
            dragDismiss={customize.pageDragDismiss}
          />
        </View>
      );
    case 'page-shot':
      return (
        <View style={styles.previewBlock}>
          <PageShotDemo mode="light" />
        </View>
      );
    case 'menu':
      return (
        <View style={styles.previewBlock}>
          <EgMenu mode="light" align="center" forceRnImplementation />
        </View>
      );
    case 'layout-content':
      return (
        <View style={styles.previewBlock}>
          <LayoutContentTabDemo mode="light" />
        </View>
      );
    case 'press':
      return (
        <PressPreview
          colors={colors}
          pressIntensity={customize.pressIntensity}
          pressScaleDirection={customize.pressScaleDirection}
        />
      );
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  previewBlock: {
    width: '100%',
    alignItems: 'center',
    gap: theme.layout.cardGap,
    paddingVertical: theme.layout.cardPaddingVertical,
  },
  tapButton: {
    minWidth: 200,
    paddingHorizontal: theme.layout.cardPaddingHorizontal,
    paddingVertical: theme.layout.cardPaddingVertical,
    borderRadius: theme.radius.full,
    alignItems: 'center',
  },
  tapLabel: {
    ...edsTokenFont('body-large', '600'),
  },
});