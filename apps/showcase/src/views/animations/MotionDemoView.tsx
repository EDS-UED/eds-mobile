import { resolveThemeMode } from '@eds/mobile-components/catalog';
import { MotionDemo } from '@eds/mobile-components/preview/motion';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

import { useShowcaseStackNav } from '@/hooks/useShowcaseStackNav';
import { ShowcaseNavBlurBackdrop } from '@/navigation/ShowcaseNavBlurBackdrop';

export function MotionDemoView() {
  const scheme = useColorScheme();
  const normalizedScheme = scheme === 'light' || scheme === 'dark' ? scheme : undefined;
  const mode = resolveThemeMode(normalizedScheme);
  const title = 'Motion 演示';
  const { stackScreenOptions, rnNavBar } = useShowcaseStackNav(title);

  return (
    <>
      <Stack.Screen options={stackScreenOptions} />
      {rnNavBar}
      <ShowcaseNavBlurBackdrop>
        <MotionDemo mode={mode} />
      </ShowcaseNavBlurBackdrop>
    </>
  );
}
