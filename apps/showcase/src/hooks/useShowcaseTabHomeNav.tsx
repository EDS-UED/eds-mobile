import {
  egNavBarNativeStackOptions,
  egNavBarScrollContentReserve,
  shouldUseEgNavBarNativeStack,
  useEgNavBarScroll,
} from '@eds/mobile-components';
import { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { showcaseRnHiddenStackHeaderOptions } from '@/navigation/showcaseEgNavBarDefaults';
import { ShowcaseRnEgNavBarOverlay } from '@/navigation/ShowcaseRnEgNavBarOverlay';
import { useShowcaseThemeContext } from '@/theme/ShowcaseThemeProvider';

/**
 * Tab index — 内容区 display 大标题；栏标题滚动后出现。RN 为浮层 `EgNavBar`（同 NavBar Demo）。
 */
export function useShowcaseTabHomeNav(title: string) {
  const { colorTheme } = useShowcaseThemeContext();
  const native = shouldUseEgNavBarNativeStack();
  const insets = useSafeAreaInsets();
  const { scrollOffset, onScroll, scrollEventThrottle, scrollEdgeActive } = useEgNavBarScroll();

  const stackScreenOptions = useMemo(() => {
    if (native) {
      return {
        ...egNavBarNativeStackOptions({
          title,
          showLeft: false,
          showRight: false,
          showTitle: scrollEdgeActive,
          background: 'auto',
          scrollEdgeActive,
          mode: colorTheme,
        }),
      };
    }

    return showcaseRnHiddenStackHeaderOptions;
  }, [colorTheme, native, scrollEdgeActive, title]);

  const rnNavBar = useMemo(
    () =>
      native ? null : (
        <ShowcaseRnEgNavBarOverlay
          title={title}
          mode={colorTheme}
          scrollOffset={scrollOffset}
          showTitle={scrollEdgeActive}
        />
      ),
    [colorTheme, native, scrollEdgeActive, scrollOffset, title],
  );

  const rnScrollPaddingTop = native ? 0 : egNavBarScrollContentReserve(insets.top);

  return {
    onScroll,
    scrollEventThrottle,
    stackScreenOptions,
    nativeStackNav: native,
    rnNavBar,
    rnScrollPaddingTop,
  };
}