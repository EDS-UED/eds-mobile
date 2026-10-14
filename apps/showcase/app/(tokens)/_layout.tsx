import { Stack } from 'expo-router/stack';

import {
  showcaseDetailScreenOptions,
  showcaseHomeScreenOptions,
  useShowcaseStackScreenOptions,
} from '@/hooks/useShowcaseStackScreenOptions';
import { showcaseTabHomeTitles } from '@/navigation/showcaseTabHomeTitles';

export default function TokensLayout() {
  const screenOptions = useShowcaseStackScreenOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen
        name="index"
        options={{ ...showcaseHomeScreenOptions, title: showcaseTabHomeTitles.tokens }}
      />
      <Stack.Screen name="category/[categoryId]" options={showcaseDetailScreenOptions} />
      <Stack.Screen
        name="[category]/[tokenName]"
        options={{ ...showcaseDetailScreenOptions, headerTitle: '' }}
      />
      <Stack.Screen name="glass-demo" options={showcaseDetailScreenOptions} />
    </Stack>
  );
}
