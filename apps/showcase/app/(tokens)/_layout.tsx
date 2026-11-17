import { Stack } from 'expo-router/stack';

import { ShowcaseSectionStack } from '@/navigation/ShowcaseSectionStack';
import { showcaseStackRouteOptions } from '@/navigation/showcaseStackLayoutOptions';

export default function TokensLayout() {
  return (
    <ShowcaseSectionStack>
      <Stack.Screen name="index" options={showcaseStackRouteOptions('')} />
      <Stack.Screen name="[category]/[tokenName]" options={showcaseStackRouteOptions('')} />
    </ShowcaseSectionStack>
  );
}
