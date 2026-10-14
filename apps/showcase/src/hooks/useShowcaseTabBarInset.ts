import { usePathname, useSegments } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  egTabBarScrollContentReserveWithSafeArea,
  shouldUseEgTabBarNativeStack,
} from '@eds/mobile-components';
import { shouldHideShowcaseTabBar } from '@/navigation/tabBarVisibility';

/** Tab 首页列表底部留白 — RN 浮动 EgTabBar；iOS 26 NativeTabs 由系统处理 inset。 */
export function useShowcaseTabBarInset(): number {
  const pathname = usePathname();
  const segments = useSegments();
  const insets = useSafeAreaInsets();

  if (shouldHideShowcaseTabBar(pathname, segments)) {
    return 0;
  }

  if (shouldUseEgTabBarNativeStack()) {
    return 0;
  }

  return egTabBarScrollContentReserveWithSafeArea(insets.bottom);
}
