import { egNavBarScrollContentReserve } from '@eds/mobile-components';
import { Stack, router } from 'expo-router';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useShowcaseStackNav } from '@/hooks/useShowcaseStackNav';

import type { TokenPreviewDestination } from '@/data/tokens/tokenPreviewDestination';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';
import { DocSectionLinkRow } from '@/views/shared/DocSectionLinkRow';
import type { ComponentDetailDocPanel } from '@/views/components/ComponentDetailDocActions';
import {
  ComponentDetailActionFooter,
  COMPONENT_DETAIL_FOOTER_HEIGHT,
} from '@/views/shared/ComponentDetailActionFooter';
import { DocContentSheet } from '@/views/shared/DocContentSheet';
import { DocSection } from '@/views/shared/DocSection';
import { edsSpacing } from '@/views/shared/resolveEdsTheme';
import { showcaseDetailScreenBackgroundColor, showcaseTheme as theme } from '@/views/shared/showcaseTheme';
import { ShowcaseNavBlurBackdrop } from '@/navigation/ShowcaseNavBlurBackdrop';

function createTokenDetailStyles(colors: ShowcaseColorMap) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: showcaseDetailScreenBackgroundColor(colors),
    },
    root: {
      flex: 1,
    },
    referenceContent: {
      gap: 0,
    },
    canvas: {
      minHeight: 160,
      width: '100%',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      padding: 0,
    },
  });
}

export type TokenDetailRootViewProps = {
  title: string;
  /** `reference` — 参数真源：主屏 USAGE + PROPS，无交互预览/定制。 */
  layoutMode?: 'interactive' | 'reference';
  preview?: ReactNode;
  customize?: ReactNode;
  usageContent: ReactNode;
  propsContent: ReactNode;
  previewMinHeight?: number;
  /** 令牌 reference 页 — 跳转渲染该效果的组件 / 动画场景。 */
  previewDestination?: TokenPreviewDestination;
};

export function TokenDetailRootView({
  title,
  layoutMode = 'interactive',
  preview,
  customize,
  usageContent,
  propsContent,
  previewMinHeight = 160,
  previewDestination,
}: TokenDetailRootViewProps) {
  const referenceOnly = layoutMode === 'reference';
  const styles = useThemedStyles(createTokenDetailStyles);
  const insets = useSafeAreaInsets();
  const {
    onScroll,
    scrollEventThrottle,
    stackScreenOptions,
    nativeStackNav,
    rnNavBar,
    rnScrollPaddingTop,
  } = useShowcaseStackNav(title);
  const previewTopInset =
    (nativeStackNav ? egNavBarScrollContentReserve(insets.top) : rnScrollPaddingTop) +
    theme.layout.cardPaddingVertical;
  const scrollBottomInset =
    COMPONENT_DETAIL_FOOTER_HEIGHT +
    Math.max(insets.bottom, edsSpacing('spacing-3')) +
    edsSpacing('spacing-4');
  const [docPanel, setDocPanel] = useState<ComponentDetailDocPanel | null>(null);

  const docSheetTitle =
    docPanel === 'usage' ? 'USAGE' : docPanel === 'props' ? 'PROPS / API' : '';

  return (
    <View style={styles.screen}>
      <Stack.Screen options={stackScreenOptions} />
      {rnNavBar}
      <ShowcaseNavBlurBackdrop>
        <ScrollView
          style={styles.root}
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="never"
          onScroll={onScroll}
          scrollEventThrottle={scrollEventThrottle}
          contentContainerStyle={{
            paddingTop: previewTopInset,
            paddingBottom: scrollBottomInset,
          }}
        >
          {referenceOnly ? (
            <View style={styles.referenceContent}>
              {previewDestination ? (
                <DocSection title="预览" cardPadding="none">
                  <DocSectionLinkRow
                    title={`效果查看 ${previewDestination.componentLabel}`}
                    hint={previewDestination.hint}
                    onPress={() => router.push(previewDestination.href)}
                  />
                </DocSection>
              ) : null}
              <DocSection title="USAGE">{usageContent}</DocSection>
              <DocSection title="PROPS / API" cardPadding="none">
                {propsContent}
              </DocSection>
            </View>
          ) : (
            <>
              <DocSection title="预览" previewScreenFrame>
                <View style={[styles.canvas, { minHeight: previewMinHeight }]}>{preview}</View>
              </DocSection>

              <DocSection title="定制" egItemGroupFrame>
                {customize}
              </DocSection>
            </>
          )}
        </ScrollView>
      </ShowcaseNavBlurBackdrop>

      {referenceOnly ? null : <ComponentDetailActionFooter onOpen={setDocPanel} />}

      <DocContentSheet
        visible={docPanel != null}
        title={docSheetTitle}
        onClose={() => setDocPanel(null)}
      >
        {docPanel === 'usage' ? usageContent : null}
        {docPanel === 'props' ? propsContent : null}
      </DocContentSheet>

    </View>
  );
}
