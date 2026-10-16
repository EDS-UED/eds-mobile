import { Stack } from 'expo-router/stack';

import {
  showcaseComponentDetailScreenOptions,
  useShowcaseStackScreenOptions,
} from '@/hooks/useShowcaseStackScreenOptions';
import { showcaseTabHomeTitles } from '@/navigation/showcaseTabHomeTitles';

export default function ComponentsLayout() {
  const screenOptions = useShowcaseStackScreenOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={{ title: showcaseTabHomeTitles.components }} />
      <Stack.Screen name="detail/[slug]" options={showcaseComponentDetailScreenOptions} />
    </Stack>
  );
}
