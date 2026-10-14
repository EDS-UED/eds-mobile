import { useShowcaseThemeContext } from '@/theme/ShowcaseThemeProvider';

export type { ShowcaseColorMap, ShowcaseColorTheme } from '@/theme/showcaseThemeTypes';

/** Semantic colors from dist color/themes/{light,dark}/semantic.css — follows system appearance. */
export function useShowcaseColors() {
  return useShowcaseThemeContext().colors;
}
