import type { ThemeMode } from '../../../theme/index.js';

export type EgTabBarNativeTriggerIcon = {
  sf: string | { default: string; selected: string };
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
  minimizeBehavior?: 'automatic' | 'onScrollDown' | 'never';
};
