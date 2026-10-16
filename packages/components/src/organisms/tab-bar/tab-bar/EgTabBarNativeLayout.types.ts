import type { ReactNode } from 'react';

import type { ThemeMode } from '../../../theme/index.js';
import type { EgTabBarSelectionAccent } from '../_shared/tabBarSelectionAccent.js';

/** Metro 静态资源（`import x from './a.png'`）或 `{ uri }` */
export type EgTabBarNativeImageSource = number | { uri: string };

export type EgTabBarNativeTriggerIcon = {
  /** EDS 图标位图（template · 系统 tint 着色）；优先于 `sf` */
  src?: { default: EgTabBarNativeImageSource; selected: EgTabBarNativeImageSource };
  sf?: string | { default: string; selected: string };
  md: string;
};

/** 与 Expo Router `NativeTabs.Trigger` 的 `name` 一致（含括号路由组）。 */
export type EgTabBarNativeTabSpec = {
  routeName: string;
  label: string;
  icon?: EgTabBarNativeTriggerIcon;
  badge?: string;
  /** 隐藏单个 Trigger（仍保留路由） */
  hidden?: boolean;
};

export type EgTabBarNativeLayoutProps = {
  tabs: EgTabBarNativeTabSpec[];
  mode?: ThemeMode;
  /** 整栏隐藏（内层 Stack 等） */
  hidden?: boolean;
  tintColor?: string;
  /** 未传 `tintColor` 时 — Cregis 用 `decor`。默认 `brand`。 */
  selectionAccent?: EgTabBarSelectionAccent;
  minimizeBehavior?: 'automatic' | 'onScrollDown' | 'never';
};

export type EgTabBarNativeViewProps = {
  /** 默认 `EG_TAB_BAR_NATIVE_TABS`（Figma 默认 Label × 5） */
  tabs?: EgTabBarNativeTabSpec[];
  /** 每个 Tab 的内容；`routeName` 作为原生 screenKey */
  renderScreen: (tab: EgTabBarNativeTabSpec, index: number) => ReactNode;
  selectedIndex?: number;
  defaultSelectedIndex?: number;
  onSelectedIndexChange?: (index: number) => void;
  disabled?: boolean;
  mode?: ThemeMode;
  tintColor?: string;
  selectionAccent?: EgTabBarSelectionAccent;
  minimizeBehavior?: 'automatic' | 'onScrollDown' | 'never';
};
