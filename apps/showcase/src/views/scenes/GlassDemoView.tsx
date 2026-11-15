import { resolveThemeMode } from '@eds/mobile-components/catalog';
import { LiquidGlassDemo } from '@eds/mobile-components/preview/liquid-glass';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

import { EdsMobileRnPrincipleCallout } from '@/components/EdsMobileRnPrincipleCallout';
import { useShowcaseStackNav } from '@/hooks/useShowcaseStackNav';
import { ShowcaseStackScreen } from '@/views/shared/ShowcaseStackScreen';
import { ShowcaseNavBlurBackdrop } from '@/navigation/ShowcaseNavBlurBackdrop';

export function GlassDemoView() {
  const scheme = useColorScheme();
  const normalizedScheme = scheme === 'light' || scheme === 'dark' ? scheme : undefined;
  const mode = resolveThemeMode(normalizedScheme);
  const title = '液态玻璃';
  const { stackScreenOptions, rnNavBar } = useShowcaseStackNav(title);

  return (
    <ShowcaseStackScreen>
      <Stack.Screen options={stackScreenOptions} />
      {rnNavBar}
      <ShowcaseNavBlurBackdrop>
        <LiquidGlassDemo mode={mode} prepend={<EdsMobileRnPrincipleCallout />} />
      </ShowcaseNavBlurBackdrop>
    </ShowcaseStackScreen>
  );
}
