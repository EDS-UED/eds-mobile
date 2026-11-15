import type { Href } from 'expo-router';
import type { EgTabBarNativeTabSpec } from '@eds/mobile-components';

export type ShowcaseNavTab = EgTabBarNativeTabSpec & {
  key: string;
  href: Href;
};

/** Expo Router tab route ↔ EgTabBar 项（顺序与根导航一致）。 */
/** 纯文案底栏 — 无 SF / MD icon，与 EgTabBarText 一致。 */
export const showcaseNavTabs = [
  {
    routeName: '(tokens)',
    key: 'tokens',
    label: '令牌',
    href: '/(tokens)' as Href,
  },
  {
    routeName: '(animations)',
    key: 'animations',
    label: '动画',
    href: '/(animations)' as Href,
  },
  {
    routeName: '(components)',
    key: 'components',
    label: '组件',
    href: '/(components)' as Href,
  },
  {
    routeName: '(patterns)',
    key: 'patterns',
    label: '数据',
    href: '/(patterns)' as Href,
  },
  {
    routeName: '(basics)',
    key: 'basics',
    label: '基础',
    href: '/(basics)' as Href,
  },
] as const satisfies readonly ShowcaseNavTab[];

export const SHOWCASE_TAB_BAR_TEXT_TAB_COUNT = 5;

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
