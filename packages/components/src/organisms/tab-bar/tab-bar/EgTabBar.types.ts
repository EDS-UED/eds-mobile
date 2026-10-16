import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { ThemeMode } from '../../../theme/index.js';
import type { EgTabBarSelectionAccent } from '../_shared/tabBarSelectionAccent.js';

export type EgTabBarItemData = {
  key: string;
  label: string;
  /** 与 Bottom Tabs / Expo Router `Screen name` 一致时，用于 `createEgTabBarBottomTabsBinding` */
  routeName?: string;
  /** 默认 eds-square（选中 `stroke-color-brand` · 未选中 `stroke-base-primary`） */
  icon?: ReactNode;
  /** 设计系统 icon 名；与 `icon` 二选一，`icon` 优先 */
  symbolName?: string;
  /** 选中态 icon（常见 `*-fill`）；缺省仍用 `symbolName` */
  symbolNameSelected?: string;
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
  /** 选中 label / icon 强调色 — Cregis 为 `decor`。默认 `brand`。 */
  selectionAccent?: EgTabBarSelectionAccent;
};
