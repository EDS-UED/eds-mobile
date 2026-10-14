import { useShowcaseThemeContext } from '@/theme/ShowcaseThemeProvider';
import { showcaseTheme } from '@/views/shared/showcaseTheme';

/** Layout / typography tokens + runtime light/dark semantic colors. */
export function useShowcaseTheme() {
  const { colors, docColors, colorTheme } = useShowcaseThemeContext();
  return {
    ...showcaseTheme,
    colors,
    docColors,
    colorTheme,
  };
}
