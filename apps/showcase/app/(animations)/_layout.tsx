import { Stack } from 'expo-router/stack';

import { ShowcaseSectionStack } from '@/navigation/ShowcaseSectionStack';
import { showcaseStackRouteOptions } from '@/navigation/showcaseStackLayoutOptions';

export default function AnimationsLayout() {
  return (
    <ShowcaseSectionStack>
      <Stack.Screen name="index" options={showcaseStackRouteOptions('')} />
      <Stack.Screen name="scenario/[scenarioId]" options={showcaseStackRouteOptions('')} />
      <Stack.Screen name="scene/[slug]" options={showcaseStackRouteOptions('')} />
      <Stack.Screen name="motion/[motionId]" options={showcaseStackRouteOptions('')} />
      <Stack.Screen name="motion-demo" options={showcaseStackRouteOptions('Motion 演示')} />
      <Stack.Screen name="glass-demo" options={showcaseStackRouteOptions('液态玻璃')} />
    </ShowcaseSectionStack>
  );
}