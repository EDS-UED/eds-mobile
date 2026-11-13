import { EgTabBarNativeLayout } from '@eds/mobile-components';
import { GlassBlurScope } from '@eds/mobile-components/glass';
import { usePathname, useSegments } from 'expo-router';

import { ShowcaseRootProviders } from '@/layout/ShowcaseRootProviders';
import { useShowcaseThemeContext } from '@/theme/ShowcaseThemeProvider';
import { showcaseNavTabs } from '@/navigation/showcaseNavTabs';
import { useShowcaseNativeTabBarHidden } from '@/navigation/useShowcaseNativeTabBarHidden';

/** iOS 26+ — `EgTabBarNativeLayout`（系统 Tab 条 · 动效 / 位置 / 交互原生）。 */
export function ShowcaseNativeTabsLayout() {
  return (
    <ShowcaseRootProviders>
      <GlassBlurScope>
        <ShowcaseNativeTabsShell />
      </GlassBlurScope>
    </ShowcaseRootProviders>
  );
}

function ShowcaseNativeTabsShell() {
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
