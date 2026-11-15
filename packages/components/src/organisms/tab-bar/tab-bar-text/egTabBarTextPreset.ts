import type { EgTabBarItemData } from '../tab-bar/EgTabBar.types.js';

export const EG_TAB_BAR_TEXT_MAX_TABS = 6;

export function buildEgTabBarTextItems(count: number): EgTabBarItemData[] {
  const n = Math.min(EG_TAB_BAR_TEXT_MAX_TABS, Math.max(1, Math.trunc(count)));
  return Array.from({ length: n }, (_, index) => {
    const key = String(index + 1);
    return { key, label: 'Label', routeName: `Tab${key}` };
  });
}