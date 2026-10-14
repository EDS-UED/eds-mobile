import { Stack } from 'expo-router/stack';

import {
  showcaseHomeScreenOptions,
  useShowcaseStackScreenOptions,
} from '@/hooks/useShowcaseStackScreenOptions';
import { showcaseTabHomeTitles } from '@/navigation/showcaseTabHomeTitles';

export default function PatternsLayout() {
  const screenOptions = useShowcaseStackScreenOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen
        name="index"
        options={{ ...showcaseHomeScreenOptions, title: showcaseTabHomeTitles.patterns }}
      />
    </Stack>
  );
}
