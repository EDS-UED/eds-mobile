import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { ThemeMode } from '../../../theme/index.js';

export type EgTabBarItemData = {
  key: string;
  label: string;
  /** 与 Bottom Tabs / Expo Router `Screen name` 一致时，用于 `createEgTabBarBottomTabsBinding` */
  routeName?: string;
  /** 默认 eds-square（选中 `stroke-color-brand` · 未选中 `stroke-base-primary`） */
  icon?: ReactNode;
  accessibilityLabel?: string;
};

/** Figma: TabBar · TabBar✅ */
export type EgTabBarProps = {
  testID?: string;
  mode?: ThemeMode;
  items?: EgTabBarItemData[];
  selectedIndex?: number;
  defaultSelectedIndex?: number | string;
  onSelectedIndexChange?: (index: number) => void;
  disabled?: boolean;
  /** 去掉 Figma 页级 shell padding（showcase / 内嵌场景） */
  edgeToEdge?: boolean;
  style?: StyleProp<ViewStyle>;
  /** 与 EgGlass 一致 — showcase 内 blur 背衬 */
  previewBackdrop?: ReactNode;
  /**
   * iOS 26+ 默认走 NativeTabs，不渲染浮动条；Preview / 对照 Figma 时设为 true。
   */
  forceRnImplementation?: boolean;
};
