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
};

/**
 * 内层 Stack — iOS 26+ 系统栏；RN 浮层 `EgNavBar` + `onScroll`（scroll edge 走 EgNavBar 缺省）。
 */
export function useShowcaseStackNav(title: string, navExtras?: UseShowcaseStackNavOptions) {
  const colors = useShowcaseColors();
  const { colorTheme } = useShowcaseThemeContext();
  const navigation = useNavigation();
  const pageBackground = showcasePageBackgroundColor(colors);
  const insets = useSafeAreaInsets();
  const native = shouldUseEgNavBarNativeStack();
  const { scrollOffset, onScroll, scrollEventThrottle, scrollEdgeActive } = useEgNavBarScroll();
  const showRight = navExtras?.showRight ?? false;
  const right = navExtras?.right;

  const stackScreenOptions = useMemo(() => {
    if (native) {
      return {
        ...egNavBarNativeStackOptions({
          title,
          showLeft: true,
          showRight,
          showTitle: true,
          background: 'auto',
          scrollEdgeActive,
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

    return showcaseRnHiddenStackHeaderOptions;
  }, [colorTheme, native, navigation, pageBackground, right, scrollEdgeActive, showRight, title]);

  const rnNavBar = useMemo(
    () =>
      native ? null : (
        <ShowcaseRnEgNavBarOverlay
          title={title}
          mode={colorTheme}
          scrollOffset={scrollOffset}
          showLeft
          showRight={showRight}
          right={right}
          onBack={() => navigation.goBack()}
        />
      ),
    [colorTheme, native, navigation, right, scrollOffset, showRight, title],
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