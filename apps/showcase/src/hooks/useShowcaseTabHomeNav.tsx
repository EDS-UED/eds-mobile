import {
  egNavBarNativeStackOptions,
  egNavBarScrollContentReserve,
  shouldUseEgNavBarNativeStack,
  useEgNavBarScroll,
} from '@eds/mobile-components';
import { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { showcaseRnHiddenStackHeaderOptions } from '@/navigation/showcaseEgNavBarDefaults';
import { ShowcaseRnEgNavBarOverlay } from '@/navigation/ShowcaseRnEgNavBarOverlay';
import { showcasePageBackgroundColor } from '@/views/shared/showcaseTheme';
import { useShowcaseThemeContext } from '@/theme/ShowcaseThemeProvider';

/**
 * Tab 首页 — 内容区 display 大标题；iOS 26+ 系统栏，其余浮层 `EgNavBar`。
 */
export function useShowcaseTabHomeNav(title: string) {
  const colors = useShowcaseColors();
  const { colorTheme } = useShowcaseThemeContext();
  const native = shouldUseEgNavBarNativeStack();
  const insets = useSafeAreaInsets();
  const { scrollOffset, onScroll, scrollEventThrottle, scrollEdgeActive } = useEgNavBarScroll({
    nativeScrollEdge: !native,
  });

  const stackScreenOptions = useMemo(
    () => {
      if (native) {
        return {
          ...egNavBarNativeStackOptions({
            title,
            showLeft: false,
            showRight: false,
            showTitle: scrollEdgeActive,
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
    [colorTheme, colors, native, scrollEdgeActive, title],
  );

  const rnNavBar = useMemo(
    () =>
      native ? null : (
        <ShowcaseRnEgNavBarOverlay
          title={title}
          mode={colorTheme}
          scrollOffset={scrollOffset}
          showLeft={false}
          showTitle={scrollEdgeActive}
        />
      ),
    [colorTheme, native, scrollEdgeActive, scrollOffset, title],
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