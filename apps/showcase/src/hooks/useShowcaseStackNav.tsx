import {
  egNavBarNativeStackOptions,
  egNavBarScrollContentReserve,
  shouldUseEgNavBarNativeStack,
  useEgNavBarScroll,
  type EgNavBarAction,
} from '@eds/mobile-components';
import { useNavigation } from 'expo-router';
import { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { showcaseRnHiddenStackHeaderOptions } from '@/navigation/showcaseEgNavBarDefaults';
import { ShowcaseRnEgNavBarOverlay } from '@/navigation/ShowcaseRnEgNavBarOverlay';
import { showcasePageBackgroundColor } from '@/views/shared/showcaseTheme';
import { useShowcaseThemeContext } from '@/theme/ShowcaseThemeProvider';

export type UseShowcaseStackNavOptions = {
  right?: EgNavBarAction;
  showRight?: boolean;
  /** 与 Tab 首页同构 — 内容区 display 大标题，栏内标题随滚动 `scrollEdgeActive` 显隐。 */
  inlineLargeTitle?: boolean;
};

/**
 * 内层 Stack — iOS 26+ 系统栏（`auto` 静止 hidden · 滚入 soft）；其余 RN `EgNavBar` + `onScroll`。
 */
export function useShowcaseStackNav(title: string, navExtras?: UseShowcaseStackNavOptions) {
  const colors = useShowcaseColors();
  const { colorTheme } = useShowcaseThemeContext();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const native = shouldUseEgNavBarNativeStack();
  /**
   * iOS 26+ scroll edge 写进 `Stack.Screen`（静止 hidden · 滚入 soft）。
   * `nativeScrollEdge: false` — 勿再 `setOptions`，避免和本 options 抢成 automatic/hard。
   */
  const { scrollOffset, onScroll, scrollEventThrottle, scrollEdgeActive } = useEgNavBarScroll({
    nativeScrollEdge: false,
  });
  const showRight = navExtras?.showRight ?? false;
  const right = navExtras?.right;
  const inlineLargeTitle = navExtras?.inlineLargeTitle ?? false;
  const showNavTitle = inlineLargeTitle ? scrollEdgeActive : true;
  const pageBackground = showcasePageBackgroundColor(colors);

  const stackScreenOptions = useMemo(() => {
    if (native) {
      return {
        ...egNavBarNativeStackOptions({
          title,
          showLeft: true,
          showRight,
          showTitle: showNavTitle,
          background: 'auto',
          scrollEdgeActive,
          deferScrollEdgeToScrollHandler: false,
          mode: colorTheme,
          left: {
            kind: 'icon',
            icon: 'eds-arrow-left-ios',
            accessibilityLabel: '返回',
            onPress: () => navigation.goBack(),
          },
          right,
        }),
        contentStyle: { backgroundColor: pageBackground },
      };
    }

    return {
      ...showcaseRnHiddenStackHeaderOptions,
      contentStyle: { backgroundColor: pageBackground },
    };
  }, [
    colorTheme,
    inlineLargeTitle,
    native,
    navigation,
    pageBackground,
    right,
    scrollEdgeActive,
    showNavTitle,
    showRight,
    title,
  ]);

  const rnNavBar = useMemo(
    () =>
      native ? null : (
        <ShowcaseRnEgNavBarOverlay
          title={title}
          mode={colorTheme}
          scrollOffset={scrollOffset}
          showTitle={showNavTitle}
          showLeft
          showRight={showRight}
          right={right}
          onBack={() => navigation.goBack()}
        />
      ),
    [colorTheme, native, navigation, right, scrollOffset, showNavTitle, showRight, title],
  );

  const rnScrollPaddingTop = native ? 0 : egNavBarScrollContentReserve(insets.top);

  return {
    onScroll,
    scrollEventThrottle,
    stackScreenOptions: stackScreenOptions as never,
    nativeStackNav: native,
    rnNavBar,
    rnScrollPaddingTop,
  };
}