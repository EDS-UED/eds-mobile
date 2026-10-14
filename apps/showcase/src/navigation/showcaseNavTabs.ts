import type { Href } from 'expo-router';
import type { EgTabBarNativeTabSpec } from '@eds/mobile-components';

export type ShowcaseNavTab = EgTabBarNativeTabSpec & {
  key: string;
  href: Href;
};

/** Expo Router tab route ↔ EgTabBar 项（顺序与根导航一致）。 */
export const showcaseNavTabs = [
  {
    routeName: '(tokens)',
    key: 'tokens',
    label: '令牌',
    href: '/(tokens)' as Href,
    icon: { sf: { default: 'paintpalette', selected: 'paintpalette.fill' }, md: 'palette' },
  },
  {
    routeName: '(animations)',
    key: 'animations',
    label: '动画',
    href: '/(animations)' as Href,
    icon: { sf: { default: 'sparkles', selected: 'sparkles' }, md: 'auto_awesome' },
  },
  {
    routeName: '(components)',
    key: 'components',
    label: '组件',
    href: '/(components)' as Href,
    icon: { sf: { default: 'square.grid.2x2', selected: 'square.grid.2x2.fill' }, md: 'widgets' },
  },
  {
    routeName: '(patterns)',
    key: 'patterns',
    label: '数据',
    href: '/(patterns)' as Href,
    icon: { sf: { default: 'tablecells', selected: 'tablecells.fill' }, md: 'table_chart' },
  },
  {
    routeName: '(workflows)',
    key: 'workflows',
    label: '业务流',
    href: '/(workflows)' as Href,
    icon: { sf: { default: 'arrow.triangle.branch', selected: 'arrow.triangle.branch' }, md: 'account_tree' },
  },
] as const satisfies readonly ShowcaseNavTab[];

/** Showcase EgTabBar `items` — 与 `createEgTabBarBottomTabsBinding` 共用。 */
export const showcaseEgTabBarItems = showcaseNavTabs.map((tab) => ({
  key: tab.key,
  routeName: tab.routeName,
  label: tab.label,
  accessibilityLabel: tab.label,
}));

export function resolveShowcaseNavTabIndex(segments: string[]): number {
  const group = segments[0];
  if (group) {
    const byRoute = showcaseNavTabs.findIndex((tab) => tab.routeName === group);
    if (byRoute >= 0) {
      return byRoute;
    }
  }

  const slug = group?.replace(/[()]/g, '') ?? '';
  const byKey = showcaseNavTabs.findIndex((tab) => tab.key === slug);
  return byKey >= 0 ? byKey : 0;
}

/** @deprecated 用 `egTabBarScrollContentReserve()` — 随平台 shell 下边距变化 */
export { egTabBarScrollContentReserve as showcaseEgTabBarScrollReserve } from '@eds/mobile-components';
