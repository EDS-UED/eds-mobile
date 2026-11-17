import { Stack } from 'expo-router/stack';

import { ShowcaseSectionStack } from '@/navigation/ShowcaseSectionStack';
import { showcaseStackRouteOptions } from '@/navigation/showcaseStackLayoutOptions';

export default function ComponentsLayout() {
  return (
    <ShowcaseSectionStack>
      <Stack.Screen name="index" options={showcaseStackRouteOptions('')} />
      <Stack.Screen name="detail/[slug]" options={showcaseStackRouteOptions('')} />
      <Stack.Screen name="tab-bar-text-demo" options={showcaseStackRouteOptions('EgTabBarText 演示')} />
      <Stack.Screen name="tab-bar-demo" options={showcaseStackRouteOptions('TabBar 演示')} />
      <Stack.Screen name="scroll-edge-demo" options={showcaseStackRouteOptions('Scroll Edge 演示')} />
      <Stack.Screen name="page-body-demo" options={showcaseStackRouteOptions('EgPage 预览')} />
    </ShowcaseSectionStack>
  );
}