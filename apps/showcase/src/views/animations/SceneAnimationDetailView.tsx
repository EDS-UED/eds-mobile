import { Stack } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { findSceneAnimation, type SceneAnimationSlug } from '@/data/animations/sceneAnimationCatalog';
import {
  SCENE_ANIMATION_BARREL_IMPORT,
  sceneAnimationDoc,
} from '@/data/animations/sceneAnimationDoc';
import {
  defaultSceneAnimationCustomizeState,
  sceneAnimationCustomizeControls,
  type SceneAnimationCustomizeState,
} from '@/data/animations/sceneAnimationCustomize';
import { useShowcaseStackNav } from '@/hooks/useShowcaseStackNav';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';
import { CustomizePanel } from '@/views/shared/CustomizePanel';
import { DocSection } from '@/views/shared/DocSection';
import { HighlightedCssSnippet } from '@/views/shared/HighlightedCssSnippet';
import { PropsDocCardList } from '@/views/shared/PropsDocCardList';
import { ShowcaseStackScreen } from '@/views/shared/ShowcaseStackScreen';
import { ShowcaseNavBlurBackdrop } from '@/navigation/ShowcaseNavBlurBackdrop';
import { ShowcasePageScroll } from '@/views/shared/ShowcasePageScroll';
import { showcaseComponentPreviewContentStyle } from '@/views/shared/showcaseComponentPreviewCanvas';
import { showcasePageBackgroundColor, showcaseTheme as theme } from '@/views/shared/showcaseTheme';
import { SceneAnimationPreview } from '@/views/animations/SceneAnimationPreview';

function createStyles(colors: ShowcaseColorMap, nativeStackNav: boolean) {
  const pageBg = showcasePageBackgroundColor(colors);
  return StyleSheet.create({
    scrollRoot: {
      flex: 1,
      ...(nativeStackNav ? null : { backgroundColor: pageBg }),
    },
    previewContent: showcaseComponentPreviewContentStyle,
    snippetStack: {
      gap: theme.layout.cardGap,
    },
    missing: {
      padding: theme.layout.pageInset,
      color: colors['text-base-secondary'] as string,
      textAlign: 'center',
    },
  });
}

type SceneAnimationDetailViewProps = {
  slug: string;
};

export function SceneAnimationDetailView({ slug }: SceneAnimationDetailViewProps) {
  const colors = useShowcaseColors();
  const insets = useSafeAreaInsets();
  const entry = findSceneAnimation(slug);
  const sceneSlug = entry?.slug as SceneAnimationSlug | undefined;

  const [customize, setCustomize] = useState<SceneAnimationCustomizeState>(() =>
    defaultSceneAnimationCustomizeState(),
  );
  const [odometerReplayKey, setOdometerReplayKey] = useState(0);

  const controls = useMemo(
    () => (sceneSlug ? sceneAnimationCustomizeControls(sceneSlug) : []),
    [sceneSlug],
  );

  const doc = useMemo(() => (sceneSlug ? sceneAnimationDoc(sceneSlug) : null), [sceneSlug]);

  const navTitle = entry?.name ?? slug;
  const {
    onScroll,
    scrollEventThrottle,
    stackScreenOptions,
    nativeStackNav,
    rnNavBar,
    rnScrollPaddingTop,
  } = useShowcaseStackNav(navTitle);

  const styles = useMemo(() => createStyles(colors, nativeStackNav), [colors, nativeStackNav]);
  const scrollBottomExtra = insets.bottom + theme.layout.pageInset;

  if (!entry || !sceneSlug || !doc) {
    return (
      <ShowcaseStackScreen>
        <Stack.Screen options={stackScreenOptions} />
        {rnNavBar}
        <Text style={styles.missing}>未找到动画：{slug}</Text>
      </ShowcaseStackScreen>
    );
  }

  return (
    <ShowcaseStackScreen>
      <Stack.Screen options={stackScreenOptions} />
      {rnNavBar}
      <ShowcaseNavBlurBackdrop>
        <ShowcasePageScroll
          nativeStackNav={nativeStackNav}
          rnScrollPaddingTop={rnScrollPaddingTop}
          onScroll={onScroll}
          scrollEventThrottle={scrollEventThrottle}
          withTabBarInset={false}
          docSectionStack
          bottomInsetExtra={scrollBottomExtra}
          style={styles.scrollRoot}
        >
          <DocSection title="预览" previewScreenFrame>
            <View style={styles.previewContent}>
              <SceneAnimationPreview
                slug={sceneSlug}
                customize={customize}
                odometerReplayKey={sceneSlug === 'odometer' ? odometerReplayKey : 0}
              />
            </View>
          </DocSection>

          <DocSection title="定制" egItemGroupFrame>
            <CustomizePanel
              controls={controls}
              state={customize as Record<string, unknown>}
              onChange={(next) => {
                const nextActive =
                  typeof next.active === 'boolean' ? next.active : customize.active;
                if (sceneSlug === 'odometer' && nextActive) {
                  setOdometerReplayKey((k) => k + 1);
                }
                setCustomize((prev) => ({
                  ...prev,
                  active: nextActive,
                  tone:
                    (next.tone as SceneAnimationCustomizeState['tone'] | undefined) ?? prev.tone,
                }));
              }}
            />
          </DocSection>

          <DocSection title="用法">
            <View style={styles.snippetStack}>
              <HighlightedCssSnippet snippet={SCENE_ANIMATION_BARREL_IMPORT} />
              <HighlightedCssSnippet snippet={doc.importSnippet} />
              <HighlightedCssSnippet snippet={doc.usageSnippet} />
            </View>
          </DocSection>

          <DocSection title="组件 API" cardPadding="none">
            <PropsDocCardList rows={doc.propRows} />
          </DocSection>
        </ShowcasePageScroll>
      </ShowcaseNavBlurBackdrop>
    </ShowcaseStackScreen>
  );
}