import { GlassBlurScope } from '@eds/mobile-components/glass';
import { Tabs } from 'expo-router';

import { ShowcaseRootProviders } from '@/layout/ShowcaseRootProviders';
import { ShowcaseAppEgTabBar } from '@/navigation/ShowcaseAppEgTabBar';
import { showcaseNavTabs } from '@/navigation/showcaseNavTabs';

export const showcaseTabsUnstableSettings = {
  initialRouteName: '(components)',
};

/** Android / iOS 25 及以下 — JS Tabs + EgTabBar（iOS 26 见 NativeTabs 壳）。 */
export function ShowcaseJsTabsLayout() {
  return (
    <ShowcaseRootProviders>
      <GlassBlurScope>
        <Tabs
          tabBar={(props) => <ShowcaseAppEgTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            height: 0,
          },
        }}
      >
        <Tabs.Screen name="index" options={{ href: null }} />
        {showcaseNavTabs.map((tab) => (
          <Tabs.Screen key={tab.routeName} name={tab.routeName} options={{ title: tab.label }} />
        ))}
        </Tabs>
      </GlassBlurScope>
    </ShowcaseRootProviders>
  );
}
