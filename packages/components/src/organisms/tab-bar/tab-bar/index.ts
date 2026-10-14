export { EgTabBar } from './EgTabBar.js';
export { EgTabBarNativeLayout } from './EgTabBarNativeLayout.js';
export { shouldUseEgTabBarNativeStack } from '../_shared/resolveEgTabBarStack.js';
export { EgTabBarBottomTabsDock } from '../_shared/EgTabBarBottomTabsDock.js';
export {
  egTabBarScrollContentReserve,
  egTabBarScrollContentReserveWithSafeArea,
  egTabBarPillTrackHeight,
  egTabBarShellLayoutHeight,
  tabBarTrackIntrinsicHeight,
  TAB_BAR_PILL_TRACK_HEIGHT,
} from '../_shared/tabBarMetrics.js';
export {
  egTabBarScrollContentReserveForList,
  useEgTabBarShellLayout,
} from '../_shared/useEgTabBarShellLayout.js';
export {
  createEgTabBarBottomTabsBinding,
  egTabBarRouteNameForIndex,
  egTabBarSelectedIndexForActiveRoute,
} from '../_shared/egTabBarBottomTabsBinding.js';
export type {
  EgTabBarBottomTabNavigation,
  EgTabBarBottomTabNavigationState,
  EgTabBarBottomTabRoute,
  EgTabBarNavBindItem,
} from '../_shared/egTabBarBottomTabsBinding.js';
export type { EgTabBarProps, EgTabBarItemData } from './EgTabBar.types.js';
export type {
  EgTabBarNativeLayoutProps,
  EgTabBarNativeTabSpec,
  EgTabBarNativeTriggerIcon,
} from './EgTabBarNativeLayout.types.js';
