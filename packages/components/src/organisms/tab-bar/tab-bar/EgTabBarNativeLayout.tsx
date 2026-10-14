import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { resolveColor } from '../../../shared/resolveColor.js';
import { getThemeColors, resolveThemeMode, type ThemeMode } from '../../../theme/index.js';
import type { EgTabBarNativeLayoutProps } from './EgTabBarNativeLayout.types.js';

/**
 * iOS 26+ EgTabBar 原生栈 — 动效 / 位置 / 交互由系统 Tab 条（Expo NativeTabs）负责。
 * 须在 Expo Router 根 `_layout` 使用，与文件路由并列，不可作浮动 overlay。
 */
export function EgTabBarNativeLayout({
  tabs,
  mode: modeProp,
  hidden = false,
  tintColor: tintColorProp,
  minimizeBehavior = 'onScrollDown',
}: EgTabBarNativeLayoutProps) {
  const mode: ThemeMode = modeProp ?? resolveThemeMode(undefined);
  const colors = getThemeColors(mode);
  const tintColor = tintColorProp ?? resolveColor(colors, 'text-brand');

  return (
    <NativeTabs hidden={hidden} minimizeBehavior={minimizeBehavior} tintColor={tintColor}>
      {tabs.map((tab) => (
        <NativeTabs.Trigger key={tab.routeName} name={tab.routeName} hidden={tab.hidden}>
          {tab.icon ? (
            <NativeTabs.Trigger.Icon
              // EDS 侧用 string；Expo 类型为 SF Symbol / Material 字面量联合
              sf={tab.icon.sf as never}
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
