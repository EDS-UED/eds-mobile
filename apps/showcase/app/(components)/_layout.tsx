import { Stack } from 'expo-router/stack';

import {
  showcaseComponentDetailScreenOptions,
  showcaseDetailScreenOptions,
  showcaseHomeScreenOptions,
  useShowcaseStackScreenOptions,
} from '@/hooks/useShowcaseStackScreenOptions';
import { showcaseTabHomeTitles } from '@/navigation/showcaseTabHomeTitles';

export default function ComponentsLayout() {
  const screenOptions = useShowcaseStackScreenOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen
        name="index"
        options={{ ...showcaseHomeScreenOptions, title: showcaseTabHomeTitles.components }}
      />
      <Stack.Screen name="tier/[tier]" options={showcaseHomeScreenOptions} />
      <Stack.Screen name="family/[tier]/[family]" options={showcaseHomeScreenOptions} />
      <Stack.Screen name="gallery/[tier]/[family]" options={showcaseDetailScreenOptions} />
      <Stack.Screen name="detail/[slug]" options={showcaseComponentDetailScreenOptions} />
      <Stack.Screen name="nav-bar-demo" options={showcaseDetailScreenOptions} />
    </Stack>
  );
}
