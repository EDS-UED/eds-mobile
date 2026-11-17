import { Stack } from 'expo-router/stack';

import { ShowcaseSectionStack } from '@/navigation/ShowcaseSectionStack';
import { showcaseStackRouteOptions } from '@/navigation/showcaseStackLayoutOptions';

export default function BasicsLayout() {
  return (
    <ShowcaseSectionStack>
      <Stack.Screen name="index" options={showcaseStackRouteOptions('')} />
      <Stack.Screen name="gestures" options={showcaseStackRouteOptions('手势')} />
      <Stack.Screen name="scroll-edge" options={showcaseStackRouteOptions('遮罩')} />
    </ShowcaseSectionStack>
  );
}