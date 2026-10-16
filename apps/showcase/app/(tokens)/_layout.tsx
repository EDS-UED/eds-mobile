import { Stack } from 'expo-router/stack';

import { useShowcaseStackScreenOptions } from '@/hooks/useShowcaseStackScreenOptions';
import { showcaseTabHomeTitles } from '@/navigation/showcaseTabHomeTitles';

export default function TokensLayout() {
  const screenOptions = useShowcaseStackScreenOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={{ title: showcaseTabHomeTitles.tokens }} />
      <Stack.Screen name="[category]/[tokenName]" options={{ headerTitle: '' }} />
    </Stack>
  );
}
