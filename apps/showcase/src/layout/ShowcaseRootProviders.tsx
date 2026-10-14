import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { useEffect, type PropsWithChildren } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, DarkTheme, DefaultTheme } from 'expo-router/react-navigation';
import { edsFontAssets } from '@eds/mobile-tokens/fonts-native';

import { ShowcaseDevProvider } from '@/hooks/useShowcaseDev';
import { ShowcaseThemeProvider } from '@/theme/ShowcaseThemeProvider';

export function ShowcaseRootProviders({ children }: PropsWithChildren) {
  const [fontsLoaded, fontError] = useFonts(edsFontAssets);
  const scheme = useColorScheme();

  useEffect(() => {
    if (fontError) {
      console.warn('[showcase] EDS fonts failed to load — using system fonts', fontError);
    }
  }, [fontError, fontsLoaded]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
          <ShowcaseThemeProvider>
            <ShowcaseDevProvider>
              <StatusBar style="auto" />
              {children}
            </ShowcaseDevProvider>
          </ShowcaseThemeProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

