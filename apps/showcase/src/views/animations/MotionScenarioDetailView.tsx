import { Stack, router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useShowcaseStackNav } from '@/hooks/useShowcaseStackNav';
import { showcaseNavScrollContentStyle, showcaseNavScrollInset } from '@/navigation/showcaseNavScrollShell';

import {
  defaultMotionScenarioCustomizeState,
  mergePageDirection,
  motionScenarioCustomizeControls,
  type MotionScenarioCustomizeState,
  type MotionScenarioId,
} from '@/data/animations/motionScenarioCustomize';
import { findMotionScenarioDemo } from '@/data/animations/motionScenarioNav';
import { menuCustomizeDefaults } from '@/data/components/menuCustomizeModel';
import { MenuSectionsCustomizePanel } from '@/views/components/menu/MenuSectionsCustomizePanel';
import { SCENARIO_PROPS } from '@/data/tokens/motionTokenPropRows';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { CustomizePanel } from '@/views/shared/CustomizePanel';
import { DocSection } from '@/views/shared/DocSection';
import { DocSectionLinkRow } from '@/views/shared/DocSectionLinkRow';
import { PropsDocCardList } from '@/views/shared/PropsDocCardList';
import { edsSpacing } from '@/views/shared/resolveEdsTheme';
import { showcaseComponentPreviewContentStyle } from '@/views/shared/showcaseComponentPreviewCanvas';
import { ShowcaseStackScreen } from '@/views/shared/ShowcaseStackScreen';
import { showcasePageBackgroundColor, showcaseTheme as theme } from '@/views/shared/showcaseTheme';
import { MotionScenarioPreview } from '@/views/animations/MotionScenarioPreview';
import { ShowcaseNavBlurBackdrop } from '@/navigation/ShowcaseNavBlurBackdrop';

function createStyles(colors: ShowcaseColorMap, nativeStackNav: boolean) {
  const pageBg = showcasePageBackgroundColor(colors);
  return StyleSheet.create({
    scrollRoot: {
      flex: 1,
      ...(nativeStackNav ? null : { backgroundColor: pageBg }),
    },
    previewContent: showcaseComponentPreviewContentStyle,
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
  const colors = useShowcaseColors();
  const insets = useSafeAreaInsets();
  const demo = findMotionScenarioDemo(scenarioId);
  const scenario = demo?.id as MotionScenarioId | undefined;

  const [customize, setCustomize] = useState<MotionScenarioCustomizeState>(() =>
    defaultMotionScenarioCustomizeState(),
  );

  const [menuCustomize, setMenuCustomize] = useState<Record<string, unknown>>(() => ({
    ...menuCustomizeDefaults,
  }));

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
  const styles = useThemedStyles((c) => createStyles(c, nativeStackNav));
  const scrollBottom =
    Math.max(insets.bottom, edsSpacing('spacing-3')) + edsSpacing('spacing-8');

  if (!demo || !scenario) {
    return (
      <ShowcaseStackScreen>
        <Text style={styles.missing}>未找到场景 {scenarioId}</Text>
      </ShowcaseStackScreen>
    );
  }

  return (
    <ShowcaseStackScreen>
      <Stack.Screen options={stackScreenOptions} />
      {rnNavBar}
      <ShowcaseNavBlurBackdrop>
        <ScrollView
          style={styles.scrollRoot}
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior={showcaseNavScrollInset(nativeStackNav)}
          onScroll={onScroll}
          scrollEventThrottle={scrollEventThrottle}
          contentContainerStyle={[
            showcaseNavScrollContentStyle(nativeStackNav, rnScrollPaddingTop),
            { paddingBottom: scrollBottom },
          ]}
        >
          <DocSection title="预览" previewScreenFrame>
            <View style={styles.previewContent}>
              <MotionScenarioPreview
                scenario={scenario}
                colors={colors}
                customize={customize}
                menuCustomize={menuCustomize}
              />
            </View>
          </DocSection>

          <DocSection title="定制" egItemGroupFrame>
            {scenario === 'menu' ? (
              <MenuSectionsCustomizePanel
                state={menuCustomize}
                onChange={(next) => setMenuCustomize((prev) => ({ ...prev, ...next }))}
              />
            ) : (
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
            )}
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

    </ShowcaseStackScreen>
  );
}