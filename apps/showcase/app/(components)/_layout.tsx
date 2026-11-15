import { Stack } from 'expo-router/stack';

import {
  showcaseComponentDetailScreenOptions,
  useShowcaseStackScreenOptions,
} from '@/hooks/useShowcaseStackScreenOptions';
import { showcaseStackRouteOptions } from '@/navigation/showcaseStackLayoutOptions';

export default function ComponentsLayout() {
  const screenOptions = useShowcaseStackScreenOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={showcaseStackRouteOptions('')} />
      <Stack.Screen
        name="detail/[slug]"
        options={{ ...showcaseComponentDetailScreenOptions, ...showcaseStackRouteOptions('') }}
      />
      <Stack.Screen name="tab-bar-text-demo" options={showcaseStackRouteOptions('EgTabBarText 演示')} />
      <Stack.Screen name="tab-bar-demo" options={showcaseStackRouteOptions('TabBar 演示')} />
      <Stack.Screen name="scroll-edge-demo" options={showcaseStackRouteOptions('Scroll Edge 演示')} />
    </Stack>
  );
}
