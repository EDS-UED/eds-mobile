import { Stack } from 'expo-router/stack';

import { useShowcaseStackScreenOptions } from '@/hooks/useShowcaseStackScreenOptions';
import { showcaseStackRouteOptions } from '@/navigation/showcaseStackLayoutOptions';

export default function TokensLayout() {
  const screenOptions = useShowcaseStackScreenOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={showcaseStackRouteOptions('')} />
      <Stack.Screen name="[category]/[tokenName]" options={showcaseStackRouteOptions('')} />
    </Stack>
  );
}
