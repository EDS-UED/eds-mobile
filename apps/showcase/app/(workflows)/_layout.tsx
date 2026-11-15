import { Stack } from 'expo-router/stack';

import { useShowcaseStackScreenOptions } from '@/hooks/useShowcaseStackScreenOptions';
import { showcaseStackRouteOptions } from '@/navigation/showcaseStackLayoutOptions';

export default function WorkflowsLayout() {
  const screenOptions = useShowcaseStackScreenOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={showcaseStackRouteOptions('')} />
    </Stack>
  );
}
