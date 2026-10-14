import { isIOS26OrLater } from '@/navigation/iosPlatform';
import { ShowcaseJsTabsLayout, showcaseTabsUnstableSettings } from '@/navigation/ShowcaseJsTabsLayout';
import { ShowcaseNativeTabsLayout } from '@/navigation/ShowcaseNativeTabsLayout';

export const unstable_settings = showcaseTabsUnstableSettings;

export default function RootLayout() {
  if (isIOS26OrLater) {
    return <ShowcaseNativeTabsLayout />;
  }

  return <ShowcaseJsTabsLayout />;
}
