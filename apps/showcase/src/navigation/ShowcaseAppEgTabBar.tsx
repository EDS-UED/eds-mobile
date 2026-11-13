import { createEgTabBarExpoBottomTabsBinding } from '@eds/mobile-components';
import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs/types';

import { ShowcaseEgTabBarShell } from '@/navigation/ShowcaseEgTabBarShell';
import { showcaseEgTabBarItems } from '@/navigation/showcaseNavTabs';

/** Expo Router 58 自定义 tabBar — 与内置 BottomTabBar 同契约（route.key · tabPress）。 */
export function ShowcaseAppEgTabBar({ state, emitter, navigateToTab }: BottomTabBarProps) {
  const binding = createEgTabBarExpoBottomTabsBinding(
    showcaseEgTabBarItems,
    state,
    emitter,
    navigateToTab,
  );

  return <ShowcaseEgTabBarShell {...binding} />;
}
