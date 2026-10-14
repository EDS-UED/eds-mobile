import {
  EgNavBar,
  GlassBlurBackdrop,
  GlassBlurScope,
  egNavBarNativeStackOptions,
  egNavBarScrollContentReserve,
  shouldUseEgNavBarNativeStack,
  useEgNavBarScroll,
} from '@eds/mobile-components';
import type { EgNavBarAction, EgNavBarBackground } from '@eds/mobile-components';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { useShowcaseThemeContext } from '@/theme/ShowcaseThemeProvider';
import { showcaseTheme } from '@/views/shared/showcaseTheme';
import { GlassBoxPreviewBackdropGradient } from '@/views/tokens/glassBoxPreviewBackdrop';

export type ShowcaseNavBarDemoParams = {
  title?: string;
  showLeft?: string;
  showTitle?: string;
  showRight?: string;
  rightIconCount?: string;
  background?: string;
  forceRn?: string;
};

const DEMO_ROWS = Array.from({ length: 24 }, (_, index) => `列表项 ${index + 1}`);
const BACKGROUNDS: EgNavBarBackground[] = ['auto', 'visible', 'hidden'];

function flag(value: string | undefined, fallback: boolean): boolean {
  if (value === '1') return true;
  if (value === '0') return false;
  return fallback;
}

/**
 * 全屏演示 — 真实状态栏 + 导航栏：
 * iOS 26+ 交给系统 UINavigationBar（`egNavBarNativeStackOptions`）；其它平台 / 强制 RN → `EgNavBar`。
 */
export function ShowcaseNavBarDemoView() {
  const params = useLocalSearchParams<ShowcaseNavBarDemoParams>();
  const colors = useShowcaseColors();
  const { colorTheme } = useShowcaseThemeContext();
  const insets = useSafeAreaInsets();
  const { scrollOffset, onScroll, scrollEventThrottle } = useEgNavBarScroll();

  const title = params.title ?? '标题';
  const showLeft = flag(params.showLeft, true);
  const showTitle = flag(params.showTitle, true);
  const showRight = flag(params.showRight, true);
  const background = BACKGROUNDS.find((item) => item === params.background) ?? 'auto';
  const right: EgNavBarAction = {
    kind: 'icon',
    icon: 'eds-list-lattice-mobile',
    iconCount: params.rightIconCount === '2' ? 2 : 1,
    iconAlt: 'eds-add',
    accessibilityLabel: '更多',
  };
  const native = shouldUseEgNavBarNativeStack() && !flag(params.forceRn, false);
  const pageBackground = colors.page as string;

  const content = (
    <>
      <View style={styles.orbRow}>
        <GlassBoxPreviewBackdropGradient colors={colors} />
      </View>
      {DEMO_ROWS.map((row) => (
        <View
          key={row}
          style={[styles.row, { backgroundColor: colors['material-card-shallow'] as string }]}
        >
          <Text style={{ color: colors['text-base-primary'] as string }}>{row}</Text>
        </View>
      ))}
    </>
  );

  if (native) {
    return (
      <>
        <Stack.Screen
          options={{
            ...egNavBarNativeStackOptions({
              title,
              right,
              showLeft,
              showTitle,
              showRight,
              background,
              mode: colorTheme,
            }),
            contentStyle: { backgroundColor: pageBackground },
          }}
        />
        <ScrollView
          style={{ backgroundColor: pageBackground }}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.content}
        >
          {content}
        </ScrollView>
      </>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: pageBackground }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <GlassBlurScope>
        <GlassBlurBackdrop style={StyleSheet.absoluteFill}>
          <ScrollView
            onScroll={onScroll}
            scrollEventThrottle={scrollEventThrottle}
            contentContainerStyle={[
              styles.content,
              { paddingTop: egNavBarScrollContentReserve(insets.top) },
            ]}
          >
            {content}
          </ScrollView>
        </GlassBlurBackdrop>
        <EgNavBar
          mode={colorTheme}
          title={title}
          left={{ kind: 'icon', icon: 'eds-arrow-left-ios', accessibilityLabel: '返回', onPress: () => router.back() }}
          right={right}
          showLeft={showLeft}
          showTitle={showTitle}
          showRight={showRight}
          background={background}
          scrollOffset={scrollOffset}
          forceRnImplementation
        />
      </GlassBlurScope>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: showcaseTheme.layout.pageInset,
    paddingBottom: showcaseTheme.layout.scrollBottom,
    gap: showcaseTheme.layout.cardGap,
  },
  orbRow: {
    alignItems: 'center',
  },
  row: {
    paddingHorizontal: showcaseTheme.layout.cardPaddingHorizontal,
    paddingVertical: showcaseTheme.layout.cardPaddingVertical,
    ...showcaseTheme.blockRadius,
  },
});
