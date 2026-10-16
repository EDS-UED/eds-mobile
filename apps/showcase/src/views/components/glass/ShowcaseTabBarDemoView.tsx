import {
  CREGIS_TAB_BAR_NATIVE_TABS,
  EG_TAB_BAR_NATIVE_TABS,
  EgCregisTabBar,
  EgNavBar,
  EgTabBar,
  EgTabBarBottomTabsDock,
  EgTabBarNativeView,
  GlassBlurBackdrop,
  GlassBlurScope,
  egNavBarNativeStackOptions,
  egNavBarScrollContentReserve,
  egTabBarScrollContentReserveWithSafeArea,
  shouldUseEgTabBarNativeStack,
  useEgNavBarScroll,
} from '@eds/mobile-components';
import type { EgNavBarAction } from '@eds/mobile-components';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { useShowcaseThemeContext } from '@/theme/ShowcaseThemeProvider';
import { showcaseTheme } from '@/views/shared/showcaseTheme';
import { GlassBoxPreviewBackdropGradient } from '@/views/tokens/glassBoxPreviewBackdrop';

export type ShowcaseTabBarDemoParams = {
  variant?: string;
  defaultSelectedIndex?: string;
  disabled?: string;
};

const DEMO_TITLE = 'TabBar 演示';
const DEMO_ROWS = Array.from({ length: 24 }, (_, index) => `列表项 ${index + 1}`);

/**
 * 全屏演示（同 NavBar）：
 * - iOS 26+ — `egNavBarNativeStackOptions`（EgNavBar 原生栈）+ `EgTabBarNativeView`（Tab 原生栈）。
 * - 其它平台 — `EgNavBar` + `EgTabBar` / `EgCregisTabBar`（RN）。
 */
export function ShowcaseTabBarDemoView() {
  const params = useLocalSearchParams<ShowcaseTabBarDemoParams>();
  const colors = useShowcaseColors();
  const { colorTheme } = useShowcaseThemeContext();
  const insets = useSafeAreaInsets();
  const { scrollOffset, onScroll, scrollEventThrottle } = useEgNavBarScroll();

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

  const barProps = {
    mode: colorTheme,
    defaultSelectedIndex: Number(params.defaultSelectedIndex ?? 0),
    disabled: params.disabled === '1',
  };

  const navLeft: EgNavBarAction = {
    kind: 'icon',
    icon: 'eds-arrow-left-ios',
    accessibilityLabel: '返回',
    onPress: () => router.back(),
  };

  if (shouldUseEgTabBarNativeStack()) {
    return (
      <>
        <Stack.Screen
          options={{
            ...egNavBarNativeStackOptions({
              title: DEMO_TITLE,
              left: navLeft,
              showLeft: true,
              showTitle: true,
              showRight: false,
              background: 'auto',
              mode: colorTheme,
            }),
            contentStyle: { backgroundColor: pageBackground },
          }}
        />
        <EgTabBarNativeView
          {...barProps}
          tabs={params.variant === 'cregis' ? CREGIS_TAB_BAR_NATIVE_TABS : EG_TAB_BAR_NATIVE_TABS}
          selectionAccent={params.variant === 'cregis' ? 'decor' : 'brand'}
          renderScreen={() => (
            <ScrollView
              style={{ backgroundColor: pageBackground }}
              contentInsetAdjustmentBehavior="automatic"
              contentContainerStyle={styles.content}
            >
              {content}
            </ScrollView>
          )}
        />
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
              {
                paddingTop: egNavBarScrollContentReserve(insets.top),
                paddingBottom: egTabBarScrollContentReserveWithSafeArea(insets.bottom),
              },
            ]}
          >
            {content}
          </ScrollView>
        </GlassBlurBackdrop>
        <EgNavBar
          mode={colorTheme}
          title={DEMO_TITLE}
          left={navLeft}
          showLeft
          showTitle
          showRight={false}
          background="auto"
          scrollOffset={scrollOffset}
        />
        <EgTabBarBottomTabsDock>
          {params.variant === 'cregis' ? <EgCregisTabBar {...barProps} /> : <EgTabBar {...barProps} />}
        </EgTabBarBottomTabsDock>
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
