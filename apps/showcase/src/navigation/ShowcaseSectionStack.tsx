import { shouldUseEgEdsAnimaNativePage } from '@eds/mobile-components';
import { Stack as JsStack } from 'expo-router/js-stack';
import { Stack as NativeStack } from 'expo-router/stack';
import type { PropsWithChildren } from 'react';

import { useShowcaseStackScreenOptions } from '@/hooks/useShowcaseStackScreenOptions';

/**
 * Tab 内段 Stack — iOS 26+ `expo-router/stack`（原生 page）；Android · iOS ≤25 `expo-router/js-stack`（EDS page 弹簧）。
 */
export function ShowcaseSectionStack({ children }: PropsWithChildren) {
  const screenOptions = useShowcaseStackScreenOptions();
  const Stack = shouldUseEgEdsAnimaNativePage() ? NativeStack : JsStack;

  return (
    <Stack screenOptions={screenOptions as never}>
      {children}
    </Stack>
  );
}