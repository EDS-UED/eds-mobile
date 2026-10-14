import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  egTabBarScrollContentReserveWithSafeArea,
  TAB_BAR_SHELL_PADDING_BOTTOM,
} from './tabBarMetrics.js';

/** Android 底壳延伸进系统导航区；pill 仍按 token 下边距 + safe area 抬起。 */
export function useEgTabBarShellLayout() {
  const { bottom: safeAreaBottom } = useSafeAreaInsets();
  const safeExtension = Platform.OS === 'android' ? safeAreaBottom : 0;

  return {
    safeExtension,
    rootMinHeight: egTabBarScrollContentReserveWithSafeArea(safeAreaBottom),
    shellPaddingBottom: TAB_BAR_SHELL_PADDING_BOTTOM + safeExtension,
    scrollContentReserve: egTabBarScrollContentReserveWithSafeArea(safeAreaBottom),
  };
}

/** 无 SafeAreaProvider 时的静态占位（与 hook 默认一致）。 */
export function egTabBarScrollContentReserveForList(safeAreaBottom = 0): number {
  return egTabBarScrollContentReserveWithSafeArea(safeAreaBottom);
}
