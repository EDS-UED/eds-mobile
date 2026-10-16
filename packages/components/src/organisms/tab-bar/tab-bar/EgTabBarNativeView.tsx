import { useCallback, useEffect, useState } from 'react';
import { Tabs, type TabsHostProps, type TabsScreenProps } from 'react-native-screens';

import { getThemeColors, resolveThemeMode, type ThemeMode } from '../../../theme/index.js';
import { egTabBarNativeActiveTintColor } from '../_shared/tabBarSelectionAccent.js';
import { normalizeTabIndex } from '../_shared/useEgTabBarController.js';
import { EG_TAB_BAR_NATIVE_TABS } from './egTabBarNativePreset.js';
import type { EgTabBarNativeTriggerIcon, EgTabBarNativeViewProps } from './EgTabBarNativeLayout.types.js';

type TabsScreenIcon = NonNullable<NonNullable<TabsScreenProps['ios']>['icon']>;

/** `icon` 与 `selectedIcon` 须同 type（react-native-screens 约束）。 */
function nativeIcon(
  icon: EgTabBarNativeTriggerIcon | undefined,
  selected: boolean,
): TabsScreenIcon | undefined {
  if (icon?.src) {
    const source = selected ? icon.src.selected : icon.src.default;
    return { type: 'templateSource', templateSource: source as never };
  }
  if (icon?.sf) {
    const name = typeof icon.sf === 'string' ? icon.sf : selected ? icon.sf.selected : icon.sf.default;
    return { type: 'sfSymbol', name };
  }
  return undefined;
}

/**
 * iOS 26+ EgTabBar 原生栈（独立容器）— 系统 UITabBarController 承担材质、动效与交互。
 * 不依赖 Expo Router：可嵌在任意页面 / React Navigation screen 内；文件路由根布局用 `EgTabBarNativeLayout`。
 */
export function EgTabBarNativeView({
  tabs = EG_TAB_BAR_NATIVE_TABS,
  renderScreen,
  selectedIndex: selectedIndexProp,
  defaultSelectedIndex = 0,
  onSelectedIndexChange,
  disabled = false,
  mode: modeProp,
  tintColor: tintColorProp,
  selectionAccent = 'brand',
  minimizeBehavior = 'onScrollDown',
}: EgTabBarNativeViewProps) {
  const mode: ThemeMode = modeProp ?? resolveThemeMode(undefined);
  const colors = getThemeColors(mode);
  const tintColor =
    tintColorProp ?? egTabBarNativeActiveTintColor(colors, selectionAccent);

  const fallbackIndex = normalizeTabIndex(defaultSelectedIndex, 0);
  const [internalIndex, setInternalIndex] = useState(fallbackIndex);
  const [provenance, setProvenance] = useState(0);
  const selectedIndex = Math.min(
    Math.max(normalizeTabIndex(selectedIndexProp ?? internalIndex, fallbackIndex), 0),
    tabs.length - 1,
  );

  useEffect(() => {
    if (selectedIndexProp === undefined) {
      setInternalIndex(fallbackIndex);
    }
  }, [fallbackIndex, selectedIndexProp]);

  const onTabSelected = useCallback<NonNullable<TabsHostProps['onTabSelected']>>(
    (event) => {
      const { selectedScreenKey, provenance: next } = event.nativeEvent;
      setProvenance(next);
      const index = tabs.findIndex((tab) => tab.routeName === selectedScreenKey);
      if (index < 0 || index === selectedIndex) {
        return;
      }
      if (selectedIndexProp === undefined) {
        setInternalIndex(index);
      }
      onSelectedIndexChange?.(index);
    },
    [onSelectedIndexChange, selectedIndex, selectedIndexProp, tabs],
  );

  const selectedTab = tabs[selectedIndex];
  if (!selectedTab) {
    return null;
  }

  return (
    <Tabs.Host
      colorScheme={mode}
      navStateRequest={{ selectedScreenKey: selectedTab.routeName, baseProvenance: provenance }}
      onTabSelected={onTabSelected}
      ios={{ tabBarTintColor: tintColor, tabBarMinimizeBehavior: minimizeBehavior }}
    >
      {tabs
        .filter((tab) => !tab.hidden)
        .map((tab) => (
          <Tabs.Screen
            key={tab.routeName}
            screenKey={tab.routeName}
            title={tab.label}
            badgeValue={tab.badge === '' ? undefined : tab.badge}
            preventNativeSelection={disabled}
            ios={{ icon: nativeIcon(tab.icon, false), selectedIcon: nativeIcon(tab.icon, true) }}
          >
            {renderScreen(tab, tabs.indexOf(tab))}
          </Tabs.Screen>
        ))}
    </Tabs.Host>
  );
}
