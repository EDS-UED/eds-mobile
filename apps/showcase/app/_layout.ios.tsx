import { EgTabBarNativeLayout, shouldUseEgTabBarNativeStack } from '@eds/mobile-components';
import { GlassBlurScope } from '@eds/mobile-components/glass';
import { usePathname, useSegments } from 'expo-router';

import { ShowcaseRootProviders } from '@/layout/ShowcaseRootProviders';
import { ShowcaseJsTabsLayout, showcaseTabsUnstableSettings } from '@/navigation/ShowcaseJsTabsLayout';
import { useShowcaseNativeTabBarHidden } from '@/navigation/useShowcaseNativeTabBarHidden';
import { showcaseNavTabs } from '@/navigation/showcaseNavTabs';
import { useShowcaseThemeContext } from '@/theme/ShowcaseThemeProvider';

export const unstable_settings = showcaseTabsUnstableSettings;

function ShowcaseIosNativeTabsRoot() {
  const pathname = usePathname();
  const segments = useSegments();
  const { colorTheme } = useShowcaseThemeContext();
  const hidden = useShowcaseNativeTabBarHidden(pathname, segments);

  return (
    <EgTabBarNativeLayout
      tabs={[...showcaseNavTabs]}
      mode={colorTheme}
      hidden={hidden}
      minimizeBehavior="onScrollDown"
    />
  );
}

/**
 * iOS 26+ — Expo Router 根 `_layout` 直接挂载 `NativeTabs`（减少中间层与 tab 切换竞态）。
 * ≤25 — JS Tabs + EgTabBar。
 */
export default function RootLayout() {
  if (shouldUseEgTabBarNativeStack()) {
    return (
      <ShowcaseRootProviders>
        <GlassBlurScope>
          <ShowcaseIosNativeTabsRoot />
        </GlassBlurScope>
      </ShowcaseRootProviders>
    );
  }

  return <ShowcaseJsTabsLayout />;
}
