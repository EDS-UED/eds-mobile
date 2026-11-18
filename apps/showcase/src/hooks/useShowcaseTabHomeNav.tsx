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
  /** 滚入栏下后的标题区 — 稳定组件类型；iOS 26+ 走 RN 浮层，勿写系统 `headerTitle`。 */
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
    nativeScrollEdge: !native,
  });

  const showStringNavTitle = scrollEdgeActive && !hasCustomNavTitle;
  const showCustomNavTitle = scrollEdgeActive && hasCustomNavTitle;

  const stackScreenOptions = useMemo(
    () => {
      if (native) {
        return {
          ...egNavBarNativeStackOptions({
            title,
            showLeft: false,
            showRight: false,
            showTitle: hasCustomNavTitle ? false : showStringNavTitle,
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
    [colorTheme, colors, hasCustomNavTitle, native, scrollEdgeActive, showStringNavTitle, title],
  );

  const rnNavBar = useMemo(() => {
    if (native && hasCustomNavTitle) {
      if (!showCustomNavTitle) {
        return null;
      }
      return (
        <ShowcaseRnEgNavBarOverlay
          title={title}
          mode={colorTheme}
          scrollOffset={scrollOffset}
          showLeft={false}
          showTitle
          forceRnOnIos26
          titleContent={ScrollEdgeTitleComponent ? <ScrollEdgeTitleComponent /> : scrollEdgeTitleContent}
        />
      );
    }

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