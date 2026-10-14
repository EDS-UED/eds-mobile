import { ShowcaseJsTabsLayout, showcaseTabsUnstableSettings } from '@/navigation/ShowcaseJsTabsLayout';

export const unstable_settings = showcaseTabsUnstableSettings;

/** Android / Web — JS Tabs + EgTabBar。iOS 见 `_layout.ios.tsx`。 */
export default function RootLayout() {
  return <ShowcaseJsTabsLayout />;
}
