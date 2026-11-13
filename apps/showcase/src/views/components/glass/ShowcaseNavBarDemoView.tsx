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

import { parseScrollEdgeEffect } from '@/data/components/sheetsCustomizeModel';
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
  /** iOS 26+ scroll edge；缺省 / `follow` = 按 background 映射。 */
  scrollEdgeEffect?: string;
  /** `cregis-home` — 无可见标题 + 左品牌文案 + 右双 icon（scroll edge 验收）。 */
  scenario?: string;
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
 * iOS 26+ 系统 UINavigationBar（`egNavBarNativeStackOptions`）；其它平台 `EgNavBar`（RN）。
 */
export function ShowcaseNavBarDemoView() {
  const params = useLocalSearchParams<ShowcaseNavBarDemoParams>();
  const colors = useShowcaseColors();
  const { colorTheme } = useShowcaseThemeContext();
  const insets = useSafeAreaInsets();
  const { scrollOffset, onScroll, scrollEventThrottle, scrollEdgeActive } = useEgNavBarScroll();

  const cregisHome = params.scenario === 'cregis-home';
  const title = params.title ?? (cregisHome ? '主页' : '标题');
  const showLeft = flag(params.showLeft, true);
  const showTitle = flag(params.showTitle, cregisHome ? false : true);
  const showRight = flag(params.showRight, true);
  const background = BACKGROUNDS.find((item) => item === params.background) ?? 'auto';
  const scrollEdgeEffect = parseScrollEdgeEffect(params.scrollEdgeEffect);
  const right: EgNavBarAction = {
    kind: 'icon',
    icon: 'eds-list-lattice-mobile',
    iconCount: params.rightIconCount === '2' ? 2 : 1,
    iconAlt: 'eds-add',
    accessibilityLabel: '更多',
  };
  const left: EgNavBarAction | undefined = cregisHome
    ? {
        kind: 'text',
        label: 'Cregis UED',
        size: 'md',
        accessibilityLabel: 'Cregis UED',
        onPress: () => undefined,
      }
    : showLeft
      ? {
          kind: 'icon',
          icon: 'eds-arrow-left-ios',
          accessibilityLabel: '返回',
          onPress: () => router.back(),
        }
      : undefined;
  const native = shouldUseEgNavBarNativeStack();
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
              left,
              right,
              showLeft: cregisHome ? true : showLeft,
              showTitle,
              showRight,
              background,
              scrollEdgeEffect,
              scrollEdgeActive,
              mode: colorTheme,
            }),
            contentStyle: { backgroundColor: pageBackground },
          }}
        />
        <ScrollView
          style={{ backgroundColor: pageBackground }}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.content}
          onScroll={onScroll}
          scrollEventThrottle={scrollEventThrottle}
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
          left={left}
          right={right}
          showLeft={cregisHome ? true : showLeft}
          showTitle={showTitle}
          showRight={showRight}
          background={background}
          scrollOffset={scrollOffset}
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
