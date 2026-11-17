import {
  EgPage,
  EG_PAGE_CONTENT_PADDING_BOTTOM,
  EG_PAGE_CONTENT_PADDING_HORIZONTAL,
  type ThemeMode,
} from '@eds/mobile-components';
import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { parsePageBodyDemoParams } from '@/data/components/pageBodyDemoParams';
import { useShowcaseStackNav } from '@/hooks/useShowcaseStackNav';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { ShowcaseNavBlurBackdrop } from '@/navigation/ShowcaseNavBlurBackdrop';
import { ShowcasePageScroll } from '@/views/shared/ShowcasePageScroll';
import { ShowcaseStackScreen } from '@/views/shared/ShowcaseStackScreen';
import { useShowcaseScreenStyles } from '@/hooks/useShowcaseScreenStyles';
import { ShowcasePageNavigationDemo } from '@/views/animations/ShowcasePageNavigationDemo';
import { edsTokenFont } from '@/views/shared/resolveEdsTheme';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

/** EgPage 全屏预览 — 边距 Live + motion-page 栈（由详情「预览」进入）。 */
export function ShowcaseEgPageDemoView() {
  const params = useLocalSearchParams<Record<string, string | undefined>>();
  const previewState = parsePageBodyDemoParams(params);
  const mode = (previewState.mode as ThemeMode) ?? 'light';
  const contentPaddingTop = previewState.contentPaddingTop as number;
  const colors = useShowcaseColors();
  const screenStyles = useShowcaseScreenStyles();
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
          style={screenStyles.scrollRoot}
        >
          <View style={styles.insetDemo}>
            <EgPage
              mode={mode}
              contentPaddingTop={contentPaddingTop}
              contentPaddingBottom={0}
              contentInsetAdjustmentBehavior="automatic"
              style={styles.page}
              contentContainerStyle={styles.pageContent}
            >
              <View style={[styles.block, { backgroundColor: card }]}>
                <Text style={[styles.blockTitle, { color: primary }]}>内容区</Text>
                <Text style={[styles.blockMeta, { color: secondary }]}>
                  左右 {EG_PAGE_CONTENT_PADDING_HORIZONTAL}px · 顶 {contentPaddingTop}px · 底{' '}
                  {EG_PAGE_CONTENT_PADDING_BOTTOM}px
                </Text>
              </View>
            </EgPage>
          </View>

          <View style={styles.stackSection}>
            <Text style={[styles.sectionLabel, { color: secondary }]}>motion-page · 全栈演示</Text>
            <ShowcasePageNavigationDemo direction="horizontal" dragDismiss />
          </View>
        </ShowcasePageScroll>
      </ShowcaseNavBlurBackdrop>
    </ShowcaseStackScreen>
  );
}

const styles = StyleSheet.create({
  insetDemo: {
    minHeight: 120,
    borderRadius: theme.blockRadius.borderRadius,
    overflow: 'hidden',
  },
  page: {
    minHeight: 120,
  },
  pageContent: {
    flexGrow: 1,
  },
  block: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderRadius: theme.smoothRadius.md.borderRadius,
  },
  blockTitle: {
    ...edsTokenFont('body-large', '600'),
  },
  blockMeta: {
    marginTop: theme.spacing['spacing-1'] as number,
    ...edsTokenFont('detail', '400'),
  },
  stackSection: {
    gap: theme.layout.cardGap,
    alignItems: 'center',
  },
  sectionLabel: {
    ...edsTokenFont('detail', '400'),
    alignSelf: 'stretch',
    textAlign: 'center',
  },
});