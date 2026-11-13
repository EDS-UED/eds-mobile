import type { EgTabBarItemData } from '../tab-bar/EgTabBar.types.js';

export type EgTabBarBottomTabRoute = { key: string; name: string };

export type EgTabBarBottomTabNavigationState = {
  index: number;
  routes: EgTabBarBottomTabRoute[];
};

/** 与 React Navigation Bottom Tabs `navigation` 运行时契约一致；类型刻意宽松以兼容各版本。 */
export type EgTabBarBottomTabNavigation = {
  navigate: (name: string) => void;
  emit: (event: {
    type: 'tabPress';
    target: string;
    canPreventDefault: true;
  }) => { defaultPrevented?: boolean };
};

export type EgTabBarNavBindItem = Pick<EgTabBarItemData, 'key' | 'routeName'>;

/**
 * 当前激活 route → EgTabBar `items` 索引。
 * 勿用 Tab Navigator 的 `state.index`（可有与 items 无关的占位 route）。
 */
export function egTabBarSelectedIndexForActiveRoute(
  items: EgTabBarNavBindItem[],
  activeRouteName: string | undefined,
): number {
  if (!activeRouteName) {
    return 0;
  }
  const fromRouteName = items.findIndex((item) => item.routeName === activeRouteName);
  if (fromRouteName >= 0) {
    return fromRouteName;
  }
  const fromKey = items.findIndex((item) => item.key === activeRouteName);
  return fromKey >= 0 ? fromKey : 0;
}

/** items 索引 → Navigator `route.name`（优先 `routeName`，否则 `key`）。 */
export function egTabBarRouteNameForIndex(
  items: EgTabBarNavBindItem[],
  index: number,
): string | undefined {
  const item = items[index];
  if (!item) {
    return undefined;
  }
  return item.routeName ?? item.key;
}

export type EgTabBarExpoBottomTabsEmitter = {
  emit: (event: {
    type: 'tabPress';
    target: string;
    canPreventDefault: true;
  }) => { defaultPrevented?: boolean } | undefined;
};

/**
 * Expo Router 58+ 自定义 `tabBar` — 与 `BottomTabBar.js` 同序：`tabPress` → `navigateToTab(route.key)`。
 */
export function createEgTabBarExpoBottomTabsBinding(
  items: EgTabBarNavBindItem[],
  state: EgTabBarBottomTabNavigationState,
  emitter: EgTabBarExpoBottomTabsEmitter,
  navigateToTab: (routeKey: string) => void,
): {
  selectedIndex: number;
  onSelectedIndexChange: (index: number) => void;
} {
  const selectedIndex = egTabBarSelectedIndexForActiveRoute(
    items,
    state.routes[state.index]?.name,
  );

  return {
    selectedIndex,
    onSelectedIndexChange: (index: number) => {
      if (index < 0 || index >= items.length || index === selectedIndex) {
        return;
      }

      const routeName = egTabBarRouteNameForIndex(items, index);
      if (!routeName) {
        return;
      }

      const route = state.routes.find((entry) => entry.name === routeName);
      if (!route) {
        if (typeof __DEV__ !== 'undefined' && __DEV__) {
          console.warn(`[EgTabBar] tab route not in navigator state: "${routeName}"`);
        }
        return;
      }

      let defaultPrevented = false;
      try {
        const event = emitter.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });
        defaultPrevented = event?.defaultPrevented === true;
      } catch (error) {
        console.error('[EgTabBar] tabPress emit failed', error);
      }

      if (defaultPrevented) {
        return;
      }

      navigateToTab(route.key);
    },
  };
}

/** React Navigation Bottom Tabs ↔ EgTabBar 受控选中与 `tabPress` / navigate。 */
export function createEgTabBarBottomTabsBinding<
  Nav extends {
    navigate: (name: string) => void;
    emit: EgTabBarBottomTabNavigation['emit'];
  },
>(
  items: EgTabBarNavBindItem[],
  state: EgTabBarBottomTabNavigationState,
  navigation: Nav,
): {
  selectedIndex: number;
  onSelectedIndexChange: (index: number) => void;
} {
  const activeRoute = state.routes[state.index];
  const selectedIndex = egTabBarSelectedIndexForActiveRoute(items, activeRoute?.name);

  return {
    selectedIndex,
    onSelectedIndexChange: (index: number) => {
      const routeName = egTabBarRouteNameForIndex(items, index);
      if (!routeName) {
        return;
      }

      const route = state.routes.find((entry) => entry.name === routeName);
      if (!route) {
        return;
      }

      let defaultPrevented = false;
      try {
        const event = navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });
        defaultPrevented = event?.defaultPrevented === true;
      } catch (error) {
        console.error('[EgTabBar] tabPress emit failed', error);
      }

      if (defaultPrevented || activeRoute?.name === routeName) {
        return;
      }

      navigation.navigate(routeName);
    },
  };
}
