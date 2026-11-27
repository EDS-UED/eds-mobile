import {
  EgPage,
  EG_PAGE_CONTENT_PADDING_BOTTOM,
  EG_PAGE_CONTENT_PADDING_HORIZONTAL,
  egNavBarScrollContentReserve,
  shouldUseEgPageNativeStack,
  type ThemeMode,
} from '@eds/mobile-components';
import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { parsePageBodyDemoParams } from '@/data/components/pageBodyDemoParams';
import { useShowcaseStackNav } from '@/hooks/useShowcaseStackNav';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { ShowcaseNavBlurBackdrop } from '@/navigation/ShowcaseNavBlurBackdrop';
import { ShowcaseStackScreen } from '@/views/shared/ShowcaseStackScreen';
import { ShowcasePageNavigationDemo } from '@/views/animations/ShowcasePageNavigationDemo';
import { edsTokenFont } from '@/views/shared/resolveEdsTheme';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

/** EgPage 全屏预览 — 页根 ScrollView 驱动 NavBar scroll edge（静止 hidden · 滚入 soft）。 */
export function ShowcaseEgPageDemoView() {
  const params = useLocalSearchParams<Record<string, string | undefined>>();
  const previewState = parsePageBodyDemoParams(params);
  const mode = (previewState.mode as ThemeMode) ?? 'light';
  const contentPaddingTop = previewState.contentPaddingTop as number;
  const colors = useShowcaseColors();
  const insets = useSafeAreaInsets();
  const nativeStack = shouldUseEgPageNativeStack();
  const title = 'EgPage 预览';
  const {
    onScroll,
    scrollEventThrottle,
    stackScreenOptions,
    nativeStackNav,
    rnNavBar,
    rnScrollPaddingTop,
  } = useShowcaseStackNav(title);

  const primary = colors['text-base-primary'] as string;
  const secondary = colors['text-base-secondary'] as string;
  const card = colors['box-page-card'] as string;
  const scrollTopInset = nativeStack ? 0 : egNavBarScrollContentReserve(insets.top);

  return (
    <ShowcaseStackScreen>
      <Stack.Screen options={stackScreenOptions} />
      {rnNavBar}
      <ShowcaseNavBlurBackdrop>
        <EgPage
          mode={mode}
          topInset={scrollTopInset}
          scrollTopInset={nativeStack ? undefined : scrollTopInset}
          contentPaddingTop={contentPaddingTop}
          contentInsetAdjustmentBehavior={nativeStack ? 'automatic' : 'never'}
          nativeScrollEdge={false}
          onScroll={onScroll}
          scrollEventThrottle={scrollEventThrottle}
          style={styles.pageRoot}
          contentContainerStyle={
            nativeStackNav ? undefined : { paddingTop: rnScrollPaddingTop }
          }
        >
          <View style={[styles.block, { backgroundColor: card }]}>
            <Text style={[styles.blockTitle, { color: primary }]}>内容区</Text>
            <Text style={[styles.blockMeta, { color: secondary }]}>
              左右 {EG_PAGE_CONTENT_PADDING_HORIZONTAL}px · 顶 {contentPaddingTop}px · 底{' '}
              {EG_PAGE_CONTENT_PADDING_BOTTOM}px
            </Text>
            <Text style={[styles.blockMeta, { color: secondary }]}>
              上滑验证顶栏 scroll edge：静止 hidden · 滚入栏下 soft
            </Text>
          </View>

          {Array.from({ length: 12 }, (_, index) => (
            <View
              key={index}
              style={[styles.fillerRow, { backgroundColor: card }]}
            >
              <Text style={[styles.fillerLabel, { color: primary }]}>列表占位 {index + 1}</Text>
            </View>
          ))}

          <View style={styles.stackSection}>
            <Text style={[styles.sectionLabel, { color: secondary }]}>motion-page · 全栈演示</Text>
            <ShowcasePageNavigationDemo direction="horizontal" dragDismiss />
          </View>
        </EgPage>
      </ShowcaseNavBlurBackdrop>
    </ShowcaseStackScreen>
  );
}

const styles = StyleSheet.create({
  pageRoot: {
    flex: 1,
  },
  block: {
    paddingVertical: theme.layout.cardPaddingVertical,
    paddingHorizontal: theme.layout.cardPaddingHorizontal,
    borderRadius: theme.smoothRadius.md.borderRadius,
    gap: theme.spacing['spacing-1'] as number,
  },
  blockTitle: {
    ...edsTokenFont('body-large', '600'),
  },
  blockMeta: {
    ...edsTokenFont('detail', '400'),
  },
  fillerRow: {
    marginTop: theme.layout.cardGap,
    paddingVertical: theme.layout.cardPaddingVertical,
    paddingHorizontal: theme.layout.cardPaddingHorizontal,
    borderRadius: theme.smoothRadius.md.borderRadius,
  },
  fillerLabel: {
    ...edsTokenFont('body-medium', '500'),
  },
  stackSection: {
    marginTop: theme.layout.docSectionCardGap,
    gap: theme.layout.cardGap,
    alignItems: 'center',
    paddingBottom: theme.layout.pageInset,
  },
  sectionLabel: {
    ...edsTokenFont('detail', '400'),
    alignSelf: 'stretch',
    textAlign: 'center',
  },
});