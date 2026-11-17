import { Stack } from 'expo-router/stack';

import { ShowcaseSectionStack } from '@/navigation/ShowcaseSectionStack';
import { showcaseStackRouteOptions } from '@/navigation/showcaseStackLayoutOptions';

export default function PatternsLayout() {
  return (
    <ShowcaseSectionStack>
      <Stack.Screen name="index" options={showcaseStackRouteOptions('')} />
      <Stack.Screen name="detail/[slug]" options={showcaseStackRouteOptions('')} />
    </ShowcaseSectionStack>
  );
}