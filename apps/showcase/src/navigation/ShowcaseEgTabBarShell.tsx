import {
  EgTabBar,
  EgTabBarBottomTabsDock,
  egTabBarSelectedIndexForActiveRoute,
  shouldUseEgTabBarNativeStack,
} from '@eds/mobile-components';
import { usePathname, useSegments } from 'expo-router';

import { useShowcaseThemeContext } from '@/theme/ShowcaseThemeProvider';
import { showcaseEgTabBarItems } from '@/navigation/showcaseNavTabs';
import { shouldHideShowcaseTabBar } from '@/navigation/tabBarVisibility';

type ShowcaseEgTabBarShellProps = {
  selectedIndex?: number;
  onSelectedIndexChange: (index: number) => void;
};

export function ShowcaseEgTabBarShell({
  selectedIndex: selectedIndexProp,
  onSelectedIndexChange,
}: ShowcaseEgTabBarShellProps) {
  if (shouldUseEgTabBarNativeStack()) {
    return null;
  }

  const pathname = usePathname();
  const segments = useSegments();
  const { colorTheme } = useShowcaseThemeContext();

  if (shouldHideShowcaseTabBar(pathname, segments)) {
    return null;
  }

  const selectedIndex =
    selectedIndexProp ??
    egTabBarSelectedIndexForActiveRoute(showcaseEgTabBarItems, segments[0]);
  const items = showcaseEgTabBarItems;

  return (
    <EgTabBarBottomTabsDock>
      <EgTabBar
        testID="showcase-app-tab-bar"
        mode={colorTheme}
        items={items}
        selectedIndex={selectedIndex}
        onSelectedIndexChange={onSelectedIndexChange}
      />
    </EgTabBarBottomTabsDock>
  );
}
