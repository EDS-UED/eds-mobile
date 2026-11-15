import type { EgTabBarProps } from '../tab-bar/EgTabBar.types.js';

/** Figma: TabBar Text — 纯文案底栏，固定 Body Small Heavy。 */
export type EgTabBarTextProps = Omit<EgTabBarProps, 'itemPresentation'> & {
  /** 未传 `items` 时按数量生成 Label × n（1–6）。 */
  tabCount?: number;
};