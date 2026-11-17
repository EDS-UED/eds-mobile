import { usePathname, useSegments } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  egTabBarScrollContentReserveWithSafeArea,
  shouldUseEgTabBarNativeStack,
} from '@eds/mobile-components';
import { shouldHideShowcaseTabBar } from '@/navigation/tabBarVisibility';

/** Tab 首页列表底部留白 — 浮动 EgTabBar / iOS 26 NativeTabs 均须在 ScrollView 自垫（RN 不自动吃掉 Tab 条占位）。 */
export function useShowcaseTabBarInset(): number {
  const pathname = usePathname();
  const segments = useSegments();
  const insets = useSafeAreaInsets();

  if (shouldHideShowcaseTabBar(pathname, segments)) {
    return 0;
  }

  /** 系统 NativeTabs 由 `contentInsetAdjustmentBehavior="automatic"` 吃底栏；勿再垫浮动条 token 高。 */
  if (shouldUseEgTabBarNativeStack()) {
    return 0;
  }

  return egTabBarScrollContentReserveWithSafeArea(insets.bottom);
}
