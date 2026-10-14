import { createEgTabBarBottomTabsBinding } from '@eds/mobile-components';
import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs/types';

import { ShowcaseEgTabBarShell } from '@/navigation/ShowcaseEgTabBarShell';
import { showcaseEgTabBarItems } from '@/navigation/showcaseNavTabs';

export function ShowcaseAppEgTabBar({ state, navigation }: BottomTabBarProps) {
  const binding = createEgTabBarBottomTabsBinding(showcaseEgTabBarItems, state, navigation);

  return <ShowcaseEgTabBarShell {...binding} />;
}
