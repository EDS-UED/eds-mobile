import { Stack } from 'expo-router/stack';

import {
  showcaseDetailScreenOptions,
  showcaseHomeScreenOptions,
  useShowcaseStackScreenOptions,
} from '@/hooks/useShowcaseStackScreenOptions';
import { showcaseTabHomeTitles } from '@/navigation/showcaseTabHomeTitles';

export default function AnimationsLayout() {
  const screenOptions = useShowcaseStackScreenOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen
        name="index"
        options={{ ...showcaseHomeScreenOptions, title: showcaseTabHomeTitles.animations }}
      />
      <Stack.Screen name="motion/[motionId]" options={showcaseDetailScreenOptions} />
      <Stack.Screen name="motion-demo" options={showcaseDetailScreenOptions} />
      <Stack.Screen name="glass-demo" options={showcaseDetailScreenOptions} />
    </Stack>
  );
}
