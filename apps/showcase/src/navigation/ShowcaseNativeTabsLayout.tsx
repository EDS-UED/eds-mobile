import { EgTabBarNativeLayout } from '@eds/mobile-components';
import { usePathname, useSegments } from 'expo-router';

import { ShowcaseRootProviders } from '@/layout/ShowcaseRootProviders';
import { useShowcaseThemeContext } from '@/theme/ShowcaseThemeProvider';
import { showcaseNavTabs } from '@/navigation/showcaseNavTabs';
import { shouldHideShowcaseTabBar } from '@/navigation/tabBarVisibility';

/** iOS 26+ — `EgTabBarNativeLayout`（系统 Tab 条 · 动效 / 位置 / 交互原生）。 */
export function ShowcaseNativeTabsLayout() {
  return (
    <ShowcaseRootProviders>
      <ShowcaseNativeTabsShell />
    </ShowcaseRootProviders>
  );
}

function ShowcaseNativeTabsShell() {
  const pathname = usePathname();
  const segments = useSegments();
  const { colorTheme } = useShowcaseThemeContext();
  const hidden = shouldHideShowcaseTabBar(pathname, segments);

  return (
    <EgTabBarNativeLayout
      tabs={[...showcaseNavTabs]}
      mode={colorTheme}
      hidden={hidden}
      minimizeBehavior="onScrollDown"
    />
  );
}
