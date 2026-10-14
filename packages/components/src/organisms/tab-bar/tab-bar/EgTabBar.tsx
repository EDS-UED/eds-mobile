import type { ViewProps } from 'react-native';

import { shouldUseEgTabBarNativeStack } from '../_shared/resolveEgTabBarStack.js';
import type { EgTabBarProps } from './EgTabBar.types.js';
import { EgTabBarRn } from './EgTabBarRn.js';

/**
 * Figma TabBar 本体（RN 实装）。
 *
 * - **iOS 26+**：默认 **不绘制** — 应用须用 `EgTabBarNativeLayout`（Expo NativeTabs）承担 Tab 条。
 * - **Android / iOS ≤25**：`EgTabBarRn` + `EgGlass`（`glass-tabbar-box`）。
 * - **组件 Preview**：传 `forceRnImplementation` 强制 RN 路径。
 */
export function EgTabBar(props: EgTabBarProps & Pick<ViewProps, 'style'>) {
  if (shouldUseEgTabBarNativeStack() && !props.forceRnImplementation) {
    return null;
  }
  return <EgTabBarRn {...props} />;
}
