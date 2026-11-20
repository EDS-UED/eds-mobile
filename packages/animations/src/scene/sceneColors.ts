import { mobileTheme } from '@eds/mobile-tokens/theme';

export type SceneThemeMode = 'light' | 'dark';

export function sceneMaterialBrand(mode: SceneThemeMode = 'light') {
  return mobileTheme.colors[mode]['material-brand'] as string;
}

export function sceneStatusSuccess(mode: SceneThemeMode = 'light') {
  return mobileTheme.colors[mode]['status-success'] as string;
}

export function sceneStatusWarning(mode: SceneThemeMode = 'light') {
  return mobileTheme.colors[mode]['status-warning'] as string;
}

export function sceneMaterialBasePrimary(mode: SceneThemeMode = 'light') {
  return mobileTheme.colors[mode]['material-base-primary'] as string;
}