import {
  EgNavBar,
  EgTabBarBottomTabsDock,
  EgTabBarText,
  GlassBlurBackdrop,
  GlassBlurScope,
  egNavBarNativeStackOptions,
  egNavBarScrollContentReserve,
  egTabBarScrollContentReserveWithSafeArea,
  shouldUseEgNavBarNativeStack,
  useEgNavBarScroll,
} from '@eds/mobile-components';
import type { EgNavBarAction } from '@eds/mobile-components';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { readTabBarTextTabCount } from '@/data/components/tabBarTextCustomizeModel';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { useShowcaseThemeContext } from '@/theme/ShowcaseThemeProvider';
import { showcaseEgTabBarItems } from '@/navigation/showcaseNavTabs';
import { showcaseCardChromeStyle, showcasePageBackgroundColor, showcaseTheme } from '@/views/shared/showcaseTheme';
import { GlassBoxPreviewBackdropGradient } from '@/views/tokens/glassBoxPreviewBackdrop';

export type ShowcaseEgTabBarTextDemoParams = {
  defaultSelectedIndex?: string;
  disabled?: string;
  tabCount?: string;
};

const DEMO_TITLE = 'EgTabBarText 演示';
const DEMO_ROWS = Array.from({ length: 24 }, (_, index) => `列表项 ${index + 1}`);

function resolveDemoItems(tabCount: number) {
  const n = Math.min(showcaseEgTabBarItems.length, Math.max(1, tabCount));
  return showcaseEgTabBarItems.slice(0, n).map((tab) => ({
    key: tab.key,
    label: tab.label,
    routeName: tab.routeName,
  }));
}

/** 全屏预览 — EgNavBar + EgTabBarText（RN · 纯文案底栏）。 */
export function ShowcaseEgTabBarTextDemoView() {
  const params = useLocalSearchParams<ShowcaseEgTabBarTextDemoParams>();
  const colors = useShowcaseColors();
  const { colorTheme } = useShowcaseThemeContext();
  const insets = useSafeAreaInsets();
  const { scrollOffset, onScroll, scrollEventThrottle, scrollEdgeActive } = useEgNavBarScroll();

  const pageBackground = showcasePageBackgroundColor(colors);
  const tabCount = readTabBarTextTabCount({ tabCount: params.tabCount ?? '4' });
  const items = resolveDemoItems(tabCount);

  const barProps = {
    mode: colorTheme,
    defaultSelectedIndex: Math.min(
      items.length - 1,
      Math.max(0, Number(params.defaultSelectedIndex ?? 0)),
    ),
    disabled: params.disabled === '1',
    items,
    tabCount: items.length,
    edgeToEdge: true,
  };

  const navLeft: EgNavBarAction = {
    kind: 'icon',
    icon: 'eds-arrow-left-ios',
    accessibilityLabel: '返回',
    onPress: () => router.back(),
  };

  const listBody = (
    <>
      <View style={styles.orbRow}>
        <GlassBoxPreviewBackdropGradient colors={colors} />
      </View>
      {DEMO_ROWS.map((row) => (
        <View key={row} style={[styles.row, showcaseCardChromeStyle(colors)]}>
          <Text style={{ color: colors['text-base-primary'] as string }}>{row}</Text>
        </View>
      ))}
    </>
  );

  if (shouldUseEgNavBarNativeStack()) {
    return (
      <View style={[styles.screen, { backgroundColor: pageBackground }]}>
        <Stack.Screen
          options={{
            ...egNavBarNativeStackOptions({
              title: DEMO_TITLE,
              left: navLeft,
              showLeft: true,
              showTitle: true,
              showRight: false,
              background: 'auto',
              scrollEdgeActive,
              mode: colorTheme,
            }),
            contentStyle: { backgroundColor: pageBackground },
          }}
        />
        <GlassBlurScope>
          <GlassBlurBackdrop style={StyleSheet.absoluteFill}>
            <ScrollView
              style={{ backgroundColor: pageBackground }}
              contentInsetAdjustmentBehavior="automatic"
              onScroll={onScroll}
              scrollEventThrottle={scrollEventThrottle}
              contentContainerStyle={[
                styles.content,
                { paddingBottom: egTabBarScrollContentReserveWithSafeArea(insets.bottom) },
              ]}
            >
              {listBody}
            </ScrollView>
          </GlassBlurBackdrop>
          <EgTabBarBottomTabsDock>
            <EgTabBarText testID="tab-bar-text-demo" {...barProps} />
          </EgTabBarBottomTabsDock>
        </GlassBlurScope>
      </View>
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
            {listBody}
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
          <EgTabBarText testID="tab-bar-text-demo" {...barProps} />
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
  },
});