import type { ColorSchemeName } from 'react-native';
import mobileTheme from '@eds/mobile-tokens/theme';

export type MobileTheme = typeof mobileTheme;
export type ThemeMode = 'light' | 'dark';

export function resolveThemeMode(scheme: ColorSchemeName | null | undefined): ThemeMode {
  return scheme === 'dark' ? 'dark' : 'light';
}

export function getThemeColors(mode: ThemeMode) {
  return mobileTheme.colors[mode];
}

export function getThemeSpacing() {
  return mobileTheme.spacing;
}

export { mobileTheme };
