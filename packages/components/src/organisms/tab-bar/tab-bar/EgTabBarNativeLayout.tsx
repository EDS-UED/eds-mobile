import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { getThemeColors, resolveThemeMode, type ThemeMode } from '../../../theme/index.js';
import { egTabBarNativeActiveTintColor } from '../_shared/tabBarSelectionAccent.js';
import type {
  EgTabBarNativeLayoutProps,
  EgTabBarNativeTriggerIcon,
} from './EgTabBarNativeLayout.types.js';

function resolveNativeTabsSfProp(
  sf: EgTabBarNativeTriggerIcon['sf'],
): string | { default: string; selected: string } | undefined {
  if (sf == null) {
    return undefined;
  }
  if (typeof sf === 'string') {
    return sf;
  }
  if (sf.default === sf.selected) {
    return sf.default;
  }
  return sf;
}

/**
 * iOS 26+ EgTabBar 原生栈 — 动效 / 位置 / 交互由系统 Tab 条（Expo NativeTabs）负责。
 * 须在 Expo Router 根 `_layout` 使用，与文件路由并列，不可作浮动 overlay。
 */
export function EgTabBarNativeLayout({
  tabs,
  mode: modeProp,
  hidden = false,
  tintColor: tintColorProp,
  selectionAccent = 'brand',
  minimizeBehavior = 'onScrollDown',
}: EgTabBarNativeLayoutProps) {
  const mode: ThemeMode = modeProp ?? resolveThemeMode(undefined);
  const colors = getThemeColors(mode);
  const tintColor =
    tintColorProp ?? egTabBarNativeActiveTintColor(colors, selectionAccent);

  return (
    <NativeTabs hidden={hidden} minimizeBehavior={minimizeBehavior} tintColor={tintColor}>
      {tabs.map((tab) => (
        <NativeTabs.Trigger key={tab.routeName} name={tab.routeName} hidden={tab.hidden}>
          {tab.icon?.src ? (
            <NativeTabs.Trigger.Icon
              src={tab.icon.src as never}
              renderingMode="template"
              md={tab.icon.md as never}
            />
          ) : tab.icon ? (
            <NativeTabs.Trigger.Icon
              sf={resolveNativeTabsSfProp(tab.icon.sf) as never}
              md={tab.icon.md as never}
            />
          ) : null}
          <NativeTabs.Trigger.Label>{tab.label}</NativeTabs.Trigger.Label>
          {tab.badge != null && tab.badge !== '' ? (
            <NativeTabs.Trigger.Badge>{tab.badge}</NativeTabs.Trigger.Badge>
          ) : null}
        </NativeTabs.Trigger>
      ))}
    </NativeTabs>
  );
}
