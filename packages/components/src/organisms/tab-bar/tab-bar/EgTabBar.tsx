import type { ViewProps } from 'react-native';

import { reportNativeEnhancementBypass } from '../../../shared/nativeEnhancementGuard.js';
import { shouldUseEgTabBarNativeStack } from '../_shared/resolveEgTabBarStack.js';
import type { EgTabBarProps } from './EgTabBar.types.js';
import { EgTabBarRn } from './EgTabBarRn.js';

/**
 * 底部 Tab 条。
 *
 * - **iOS 26+**：强制系统 Tab 条，本组件不绘制 — Expo Router 用 `EgTabBarNativeLayout`，
 *   React Navigation 用 `createNativeBottomTabNavigator` + `egCregisTabBarNativeBottomTabsScreenOptions`。
 * - **Android / iOS ≤25**：`EgTabBarRn` — RN + `glass-tabbar-box`。
 */
export function EgTabBar(props: EgTabBarProps & Pick<ViewProps, 'style'>) {
  if (shouldUseEgTabBarNativeStack()) {
    reportNativeEnhancementBypass(
      'EgTabBar',
      'EgTabBarNativeLayout / EgTabBarNativeView / createNativeBottomTabNavigator + egCregisTabBarNativeBottomTabsScreenOptions',
    );
    return null;
  }
  return <EgTabBarRn {...props} />;
}
