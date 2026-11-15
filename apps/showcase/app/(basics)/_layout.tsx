import { Stack } from 'expo-router/stack';

import { useShowcaseStackScreenOptions } from '@/hooks/useShowcaseStackScreenOptions';
import { showcaseStackRouteOptions } from '@/navigation/showcaseStackLayoutOptions';

export default function BasicsLayout() {
  const screenOptions = useShowcaseStackScreenOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={showcaseStackRouteOptions('')} />
      <Stack.Screen name="parity" options={showcaseStackRouteOptions('Layout parity')} />
      <Stack.Screen name="gestures" options={showcaseStackRouteOptions('手势')} />
      <Stack.Screen name="scroll-edge" options={showcaseStackRouteOptions('遮罩')} />
    </Stack>
  );
}