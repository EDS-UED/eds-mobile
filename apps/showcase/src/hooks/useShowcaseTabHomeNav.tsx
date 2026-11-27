import {
  egNavBarNativeStackOptions,
  egNavBarScrollContentReserve,
  shouldUseEgNavBarNativeStack,
  useEgNavBarScroll,
} from '@eds/mobile-components';
import { useMemo, type ComponentType, type ReactElement } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { showcaseRnHiddenStackHeaderOptions } from '@/navigation/showcaseEgNavBarDefaults';
import { ShowcaseRnEgNavBarOverlay } from '@/navigation/ShowcaseRnEgNavBarOverlay';
import { showcasePageBackgroundColor } from '@/views/shared/showcaseTheme';
import { useShowcaseThemeContext } from '@/theme/ShowcaseThemeProvider';

export type UseShowcaseTabHomeNavOptions = {
  /** @deprecated 易随选中态重建 `options` 导致列表回顶 — 优先 `ScrollEdgeTitleComponent`。 */
  scrollEdgeTitleContent?: ReactElement | null;
  /** 滚入栏下后的标题区 — 稳定组件类型；iOS ≤25 / Android RN 浮层；iOS 26+ 仅内容区分段 + 系统 `title`。 */
  ScrollEdgeTitleComponent?: ComponentType;
};

/**
 * Tab 首页 — 内容区 display 大标题；iOS 26+ 系统栏，其余浮层 `EgNavBar`。
 */
export function useShowcaseTabHomeNav(title: string, navOptions?: UseShowcaseTabHomeNavOptions) {
  const colors = useShowcaseColors();
  const { colorTheme } = useShowcaseThemeContext();
  const native = shouldUseEgNavBarNativeStack();
  const insets = useSafeAreaInsets();
  const ScrollEdgeTitleComponent = navOptions?.ScrollEdgeTitleComponent;
  const scrollEdgeTitleContent = navOptions?.scrollEdgeTitleContent ?? null;
  const hasCustomNavTitle = Boolean(ScrollEdgeTitleComponent) || scrollEdgeTitleContent != null;
  const { scrollOffset, onScroll, scrollEventThrottle, scrollEdgeActive } = useEgNavBarScroll({
    /** 与 `Stack.Screen` 里的 `scrollEdgeEffects` 单源；勿 `setOptions` 抢写。 */
    nativeScrollEdge: false,
  });

  /** iOS 26+ 仅系统栏 — 滚入后系统 `title`；勿叠 RN `EgNavBar`（hidden → soft 单源 `useEgNavBarScroll`）。 */
  const showNativeTitle = scrollEdgeActive;

  const stackScreenOptions = useMemo(
    () => {
      if (native) {
        return {
          ...egNavBarNativeStackOptions({
            title,
            showLeft: false,
            showRight: false,
            showTitle: showNativeTitle,
            background: 'auto',
            scrollEdgeActive,
            deferScrollEdgeToScrollHandler: false,
            mode: colorTheme,
          }),
          contentStyle: { backgroundColor: showcasePageBackgroundColor(colors) },
        };
      }

      return {
        ...showcaseRnHiddenStackHeaderOptions,
        contentStyle: { backgroundColor: showcasePageBackgroundColor(colors) },
      };
    },
    [colorTheme, colors, native, scrollEdgeActive, showNativeTitle, title],
  );

  const showCustomNavTitle = scrollEdgeActive && hasCustomNavTitle;

  const rnNavBar = useMemo(() => {
    if (native) {
      return null;
    }

    return (
      <ShowcaseRnEgNavBarOverlay
        title={title}
        mode={colorTheme}
        scrollOffset={scrollOffset}
        showLeft={false}
        showTitle={scrollEdgeActive}
        scrollEdgeEffect="soft"
        titleContent={
          showCustomNavTitle && ScrollEdgeTitleComponent ? (
            <ScrollEdgeTitleComponent />
          ) : showCustomNavTitle && scrollEdgeTitleContent ? (
            scrollEdgeTitleContent
          ) : undefined
        }
      />
    );
  }, [
    ScrollEdgeTitleComponent,
    colorTheme,
    hasCustomNavTitle,
    native,
    scrollEdgeActive,
    scrollEdgeTitleContent,
    scrollOffset,
    showCustomNavTitle,
    title,
  ]);

  const rnScrollPaddingTop = native ? 0 : egNavBarScrollContentReserve(insets.top);

  return {
    onScroll,
    scrollEventThrottle,
    scrollEdgeActive,
    stackScreenOptions: stackScreenOptions as never,
    nativeStackNav: native,
    rnNavBar,
    rnScrollPaddingTop,
  };
}