import {
  egNavBarNativeStackOptions,
  egNavBarScrollContentReserve,
  shouldUseEgNavBarNativeStack,
  useEgNavBarScroll,
} from '@eds/mobile-components';
import { useNavigation } from 'expo-router';
import { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { showcaseRnHiddenStackHeaderOptions } from '@/navigation/showcaseEgNavBarDefaults';
import { ShowcaseRnEgNavBarOverlay } from '@/navigation/ShowcaseRnEgNavBarOverlay';
import { useShowcaseThemeContext } from '@/theme/ShowcaseThemeProvider';

/**
 * 内层 Stack — iOS 26+ 系统栏；RN 浮层 `EgNavBar` + `onScroll`（scroll edge 走 EgNavBar 缺省）。
 */
export function useShowcaseStackNav(title: string) {
  const { colorTheme } = useShowcaseThemeContext();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const native = shouldUseEgNavBarNativeStack();
  const { scrollOffset, onScroll, scrollEventThrottle, scrollEdgeActive } = useEgNavBarScroll();

  const stackScreenOptions = useMemo(() => {
    if (native) {
      return {
        ...egNavBarNativeStackOptions({
          title,
          showLeft: true,
          showRight: false,
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
        }),
      };
    }

    return showcaseRnHiddenStackHeaderOptions;
  }, [colorTheme, native, navigation, scrollEdgeActive, title]);

  const rnNavBar = useMemo(
    () =>
      native ? null : (
        <ShowcaseRnEgNavBarOverlay
          title={title}
          mode={colorTheme}
          scrollOffset={scrollOffset}
          showLeft
          onBack={() => navigation.goBack()}
        />
      ),
    [colorTheme, native, navigation, scrollOffset, title],
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