import type { ThemeMode } from '../../../theme/index.js';
import { egTabBarNativeActiveTintColor } from '../_shared/tabBarSelectionAccent.js';
import { getThemeColors } from '../../../theme/index.js';
import { reportNativeEnhancementBypass } from '../../../shared/nativeEnhancementGuard.js';
import type { EgTabBarNativeImageSource } from '../tab-bar/EgTabBarNativeLayout.types.js';
import { CREGIS_TAB_BAR_NATIVE_TABS } from './cregisTabBarNativePreset.js';

export type EgCregisTabBarNativeBottomTabsScreenOptions = {
  title: string;
  headerShown: false;
  tabBarIcon: (props: { focused: boolean }) => { type: 'image'; source: EgTabBarNativeImageSource };
  tabBarActiveTintColor: string;
};

/**
 * iOS 26+ — React Navigation `createNativeBottomTabNavigator` 的 `screenOptions`：
 * 系统 Tab 条 + Cregis preset（顺序 / 文案 / EDS 图标锁定在 EDS）。Tab.Screen `name` 须与 preset `routeName` 一致。
 */
export function egCregisTabBarNativeBottomTabsScreenOptions({ mode = 'light' }: { mode?: ThemeMode } = {}) {
  const colors = getThemeColors(mode);
  const tint = egTabBarNativeActiveTintColor(colors, 'brand');

  return ({ route }: { route: { name: string } }): EgCregisTabBarNativeBottomTabsScreenOptions => {
    const tab = CREGIS_TAB_BAR_NATIVE_TABS.find((t) => t.routeName === route.name);
    if (!tab?.icon?.src) {
      reportNativeEnhancementBypass(
        `EgCregisTabBar(${route.name})`,
        `CREGIS_TAB_BAR_NATIVE_TABS 中的 routeName（${CREGIS_TAB_BAR_NATIVE_TABS.map((t) => t.routeName).join(' / ')}）`,
      );
    }
    const src = tab?.icon?.src;
    return {
      title: tab?.label ?? route.name,
      headerShown: false,
      tabBarIcon: ({ focused }) => ({
        type: 'image',
        source: (focused ? src?.selected : src?.default) ?? 0,
      }),
      tabBarActiveTintColor: tint,
    };
  };
}
