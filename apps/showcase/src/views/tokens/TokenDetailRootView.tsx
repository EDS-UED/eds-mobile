import { Stack, router } from 'expo-router';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
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
import { showcaseComponentPreviewContentStyle } from '@/views/shared/showcaseComponentPreviewCanvas';
import { ShowcaseStackScreen } from '@/views/shared/ShowcaseStackScreen';
import { showcasePageBackgroundColor, showcaseTheme as theme } from '@/views/shared/showcaseTheme';
import { ShowcaseNavBlurBackdrop } from '@/navigation/ShowcaseNavBlurBackdrop';
import { ShowcasePageScroll } from '@/views/shared/ShowcasePageScroll';

function createTokenDetailStyles(colors: ShowcaseColorMap, nativeStackNav: boolean) {
  const pageBg = showcasePageBackgroundColor(colors);
  return StyleSheet.create({
    scrollRoot: {
      flex: 1,
      ...(nativeStackNav ? null : { backgroundColor: pageBg }),
    },
    previewContent: showcaseComponentPreviewContentStyle,
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
  previewDestination,
}: TokenDetailRootViewProps) {
  const referenceOnly = layoutMode === 'reference';
  const insets = useSafeAreaInsets();
  const {
    onScroll,
    scrollEventThrottle,
    stackScreenOptions,
    nativeStackNav,
    rnNavBar,
    rnScrollPaddingTop,
  } = useShowcaseStackNav(title);
  const styles = useThemedStyles((c) => createTokenDetailStyles(c, nativeStackNav));
  const scrollBottomInset =
    COMPONENT_DETAIL_FOOTER_HEIGHT +
    Math.max(insets.bottom, edsSpacing('spacing-3')) +
    edsSpacing('spacing-4');
  const [docPanel, setDocPanel] = useState<ComponentDetailDocPanel | null>(null);

  const docSheetTitle =
    docPanel === 'usage' ? 'USAGE' : docPanel === 'props' ? 'PROPS / API' : '';

  return (
    <ShowcaseStackScreen>
      <Stack.Screen options={stackScreenOptions} />
      {rnNavBar}
      <ShowcaseNavBlurBackdrop>
        <ShowcasePageScroll
          nativeStackNav={nativeStackNav}
          rnScrollPaddingTop={rnScrollPaddingTop}
          keyboardShouldPersistTaps="handled"
          onScroll={onScroll}
          scrollEventThrottle={scrollEventThrottle}
          withTabBarInset={false}
          docSectionStack
          bottomInsetExtra={scrollBottomInset}
          style={styles.scrollRoot}
        >
          {referenceOnly ? (
            <>
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
            </>
          ) : (
            <>
              <DocSection title="预览" previewScreenFrame>
                <View style={styles.previewContent}>{preview}</View>
              </DocSection>

              <DocSection title="定制" egItemGroupFrame>
                {customize}
              </DocSection>
            </>
          )}
        </ShowcasePageScroll>
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

    </ShowcaseStackScreen>
  );
}
