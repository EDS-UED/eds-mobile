import type { ReactNode } from 'react';
import type { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';
import type { ThemeMode } from '../../../theme/index.js';

/** Figma: TabBar-Item · TabBar✅ */
export type EgTabBarItemProps = {
  testID?: string;
  mode?: ThemeMode;
  label: string;
  selected?: boolean;
  disabled?: boolean;
  /** 在 EgTabBar 内由滑动指示器负责选中底，不重复铺 event-focus */
  embedded?: boolean;
  icon?: ReactNode;
  onPress?: () => void;
  onLayout?: (event: LayoutChangeEvent) => void;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};
