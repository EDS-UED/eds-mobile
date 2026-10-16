import type { EgTabBarNativeTabSpec } from './EgTabBarNativeLayout.types.js';

/** 与 `DEFAULT_TAB_BAR_ITEMS` 同序（Label × 5 · eds-square → SF `square`）。 */
export const EG_TAB_BAR_NATIVE_TABS: EgTabBarNativeTabSpec[] = ['1', '2', '3', '4', '5'].map(
  (key) => ({
    routeName: `Tab${key}`,
    label: 'Label',
    icon: {
      sf: { default: 'square', selected: 'square.fill' },
      md: 'crop_square',
    },
  }),
);
