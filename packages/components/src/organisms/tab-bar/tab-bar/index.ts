export { EgTabBar } from './EgTabBar.js';
export { EgTabBarNativeLayout } from './EgTabBarNativeLayout.js';
export { EgTabBarNativeView } from './EgTabBarNativeView.js';
export { EG_TAB_BAR_NATIVE_TABS } from './egTabBarNativePreset.js';
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
  createEgTabBarExpoBottomTabsBinding,
  egTabBarRouteNameForIndex,
  egTabBarSelectedIndexForActiveRoute,
} from '../_shared/egTabBarBottomTabsBinding.js';
export type {
  EgTabBarBottomTabNavigation,
  EgTabBarBottomTabNavigationState,
  EgTabBarBottomTabRoute,
  EgTabBarExpoBottomTabsEmitter,
  EgTabBarNavBindItem,
} from '../_shared/egTabBarBottomTabsBinding.js';
export type { EgTabBarProps, EgTabBarItemData } from './EgTabBar.types.js';
export type {
  EgTabBarNativeLayoutProps,
  EgTabBarNativeTabSpec,
  EgTabBarNativeImageSource,
  EgTabBarNativeTriggerIcon,
  EgTabBarNativeViewProps,
} from './EgTabBarNativeLayout.types.js';
