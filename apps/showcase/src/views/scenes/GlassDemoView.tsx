import { resolveThemeMode } from '@eds/mobile-components/catalog';
import { LiquidGlassDemo } from '@eds/mobile-components/preview/liquid-glass';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

import { EdsMobileRnPrincipleCallout } from '@/components/EdsMobileRnPrincipleCallout';
import { ShowcaseStackScreen } from '@/views/shared/ShowcaseStackScreen';

export function GlassDemoView() {
  const scheme = useColorScheme();
  const normalizedScheme = scheme === 'light' || scheme === 'dark' ? scheme : undefined;
  const mode = resolveThemeMode(normalizedScheme);
  return (
    <>
      <ShowcaseStackScreen>
        <LiquidGlassDemo
          mode={mode}
          prepend={<EdsMobileRnPrincipleCallout />}
        />
      </ShowcaseStackScreen>
      <Stack.Title>液态玻璃</Stack.Title>
    </>
  );
}
