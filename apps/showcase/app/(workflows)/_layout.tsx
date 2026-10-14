import { Stack } from 'expo-router/stack';

import {
  showcaseDetailScreenOptions,
  showcaseHomeScreenOptions,
  useShowcaseStackScreenOptions,
} from '@/hooks/useShowcaseStackScreenOptions';
import { showcaseTabHomeTitles } from '@/navigation/showcaseTabHomeTitles';

export default function WorkflowsLayout() {
  const screenOptions = useShowcaseStackScreenOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen
        name="index"
        options={{ ...showcaseHomeScreenOptions, title: showcaseTabHomeTitles.workflows }}
      />
      <Stack.Screen name="parity" options={showcaseDetailScreenOptions} />
    </Stack>
  );
}
