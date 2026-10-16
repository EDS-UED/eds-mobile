import { createEgTabBarBottomTabsBinding } from '../_shared/egTabBarBottomTabsBinding.js';
import type {
  EgTabBarBottomTabNavigation,
  EgTabBarBottomTabNavigationState,
} from '../_shared/egTabBarBottomTabsBinding.js';
import { CREGIS_TAB_BAR_ITEMS } from './cregisTabBarPreset.js';

/** React Navigation Bottom Tabs ↔ `EgCregisTabBar`（固定 `CREGIS_TAB_BAR_ITEMS`，consumer 勿改 items）。 */
export function createEgCregisTabBarBottomTabsBinding<
  Nav extends {
    navigate: (name: string) => void;
    emit: EgTabBarBottomTabNavigation['emit'];
  },
>(
  state: EgTabBarBottomTabNavigationState,
  navigation: Nav,
): ReturnType<typeof createEgTabBarBottomTabsBinding<Nav>> {
  return createEgTabBarBottomTabsBinding(CREGIS_TAB_BAR_ITEMS, state, navigation);
}
