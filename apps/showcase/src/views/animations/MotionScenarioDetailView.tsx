import { egNavBarScrollContentReserve } from '@eds/mobile-components';
import { Stack, router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useShowcaseStackNav } from '@/hooks/useShowcaseStackNav';
import { showcaseNavScrollInset } from '@/navigation/showcaseNavScrollShell';

import {
  defaultMotionScenarioCustomizeState,
  mergePageDirection,
  motionScenarioCustomizeControls,
  type MotionScenarioCustomizeState,
  type MotionScenarioId,
} from '@/data/animations/motionScenarioCustomize';
import { findMotionScenarioDemo } from '@/data/animations/motionScenarioNav';
import { SCENARIO_PROPS } from '@/data/tokens/motionTokenPropRows';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { CustomizePanel } from '@/views/shared/CustomizePanel';
import { DocSection } from '@/views/shared/DocSection';
import { DocSectionLinkRow } from '@/views/shared/DocSectionLinkRow';
import { PropsDocCardList } from '@/views/shared/PropsDocCardList';
import { edsSpacing } from '@/views/shared/resolveEdsTheme';
import { showcaseDetailScreenBackgroundColor, showcaseTheme as theme } from '@/views/shared/showcaseTheme';
import { MotionScenarioPreview } from '@/views/animations/MotionScenarioPreview';
import { ShowcaseNavBlurBackdrop } from '@/navigation/ShowcaseNavBlurBackdrop';

function createStyles(colors: ShowcaseColorMap) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: showcaseDetailScreenBackgroundColor(colors),
    },
    canvas: {
      minHeight: 160,
      width: '100%',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
    },
    missing: {
      padding: theme.layout.pageInset,
      color: colors['text-base-secondary'] as string,
      textAlign: 'center',
    },
  });
}

type MotionScenarioDetailViewProps = {
  scenarioId: string;
};

export function MotionScenarioDetailView({ scenarioId }: MotionScenarioDetailViewProps) {
  const styles = useThemedStyles(createStyles);
  const colors = useShowcaseColors();
  const insets = useSafeAreaInsets();
  const demo = findMotionScenarioDemo(scenarioId);
  const scenario = demo?.id as MotionScenarioId | undefined;

  const [customize, setCustomize] = useState<MotionScenarioCustomizeState>(() =>
    defaultMotionScenarioCustomizeState(),
  );

  const controls = useMemo(
    () => (scenario ? motionScenarioCustomizeControls(scenario) : []),
    [scenario],
  );

  const propRows = scenario && SCENARIO_PROPS[scenario] ? SCENARIO_PROPS[scenario] : [];

  const navTitle = demo?.label ?? scenarioId;
  const {
    onScroll,
    scrollEventThrottle,
    stackScreenOptions,
    nativeStackNav,
    rnNavBar,
    rnScrollPaddingTop,
  } = useShowcaseStackNav(navTitle);
  const previewTopInset =
    (nativeStackNav ? egNavBarScrollContentReserve(insets.top) : rnScrollPaddingTop) +
    theme.layout.cardPaddingVertical;

  if (!demo || !scenario) {
    return (
      <View style={styles.screen}>
        <Text style={styles.missing}>未找到场景 {scenarioId}</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Stack.Screen options={stackScreenOptions} />
      {rnNavBar}
      <ShowcaseNavBlurBackdrop>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior={showcaseNavScrollInset(nativeStackNav)}
          onScroll={onScroll}
          scrollEventThrottle={scrollEventThrottle}
          contentContainerStyle={{
            paddingTop: previewTopInset,
            paddingBottom: Math.max(insets.bottom, edsSpacing('spacing-3')) + edsSpacing('spacing-8'),
          }}
        >
          <DocSection title="预览" previewScreenFrame>
            <View style={styles.canvas}>
              <MotionScenarioPreview scenario={scenario} colors={colors} customize={customize} />
            </View>
          </DocSection>

          <DocSection title="定制" egItemGroupFrame>
            <CustomizePanel
              controls={controls}
              state={customize}
              onChange={(next) =>
                setCustomize((prev) => ({
                  ...prev,
                  pressIntensity:
                    (next.pressIntensity as MotionScenarioCustomizeState['pressIntensity']) ??
                    prev.pressIntensity,
                  pressScaleDirection:
                    (next.pressScaleDirection as MotionScenarioCustomizeState['pressScaleDirection']) ??
                    prev.pressScaleDirection,
                  slidePressScale:
                    typeof next.slidePressScale === 'boolean' ? next.slidePressScale : prev.slidePressScale,
                  slideFollowDrag:
                    typeof next.slideFollowDrag === 'boolean' ? next.slideFollowDrag : prev.slideFollowDrag,
                  ...mergePageDirection(prev, next),
                  pageDragDismiss:
                    typeof next.pageDragDismiss === 'boolean' ? next.pageDragDismiss : prev.pageDragDismiss,
                }))
              }
            />
          </DocSection>

          <DocSection title="组件 API" cardPadding="none">
            <PropsDocCardList rows={propRows} />
          </DocSection>

          <DocSection title="参数真源" cardPadding="none">
            <DocSectionLinkRow
              title="Motion 令牌"
              hint={`RN 代码片段 · ${demo.primaryTokenName}`}
              onPress={() => router.push(`/(tokens)/motion/${demo.primaryTokenName}`)}
            />
          </DocSection>
        </ScrollView>
      </ShowcaseNavBlurBackdrop>

    </View>
  );
}