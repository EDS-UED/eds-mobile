import { createContext, useContext, useMemo, type PropsWithChildren } from 'react';
import { useColorScheme } from 'react-native';
import mobileTheme from '@eds/mobile-tokens/theme';

import { resolveColorTheme } from '@/data/tokens/colorTokenCatalog';
import { showcaseDocColors } from '@/theme/showcaseDocColors';
import type { ShowcaseColorMap, ShowcaseColorTheme } from '@/theme/showcaseThemeTypes';

type ShowcaseThemeContextValue = {
  colorTheme: ShowcaseColorTheme;
  colors: ShowcaseColorMap;
  docColors: (typeof showcaseDocColors)[ShowcaseColorTheme];
};

const ShowcaseThemeContext = createContext<ShowcaseThemeContextValue | null>(null);

export function ShowcaseThemeProvider({ children }: PropsWithChildren) {
  const colorTheme = resolveColorTheme(useColorScheme());

  const value = useMemo(
    () => ({
      colorTheme,
      colors: mobileTheme.colors[colorTheme] as ShowcaseColorMap,
      docColors: showcaseDocColors[colorTheme],
    }),
    [colorTheme],
  );

  return <ShowcaseThemeContext.Provider value={value}>{children}</ShowcaseThemeContext.Provider>;
}

export function useShowcaseThemeContext() {
  const context = useContext(ShowcaseThemeContext);
  if (!context) {
    throw new Error('useShowcaseThemeContext must be used within ShowcaseThemeProvider');
  }
  return context;
}
