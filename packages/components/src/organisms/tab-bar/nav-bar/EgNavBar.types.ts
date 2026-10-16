import type { ViewStyle } from 'react-native';
import type { EgButtonGlassIconCount } from '../../../molecules/button/button-glass/EgButtonGlass.types.js';
import type { ControlSize } from '../../../shared/types.js';
import type { ThemeMode } from '../../../theme/index.js';

/**
 * - `auto`：下方无内容时隐藏，内容滚入栏下时显示（iOS scroll edge appearance）。
 * - `visible` / `hidden`：手动常显 / 常隐。
 */
export type EgNavBarBackground = 'auto' | 'visible' | 'hidden';

/** 左 / 右操作 — 默认 icon 胶囊（`EgButtonGlass kind="icon"`）。 */
export type EgNavBarAction = {
  kind?: 'icon' | 'text';
  icon?: string;
  iconCount?: EgButtonGlassIconCount;
  iconAlt?: string;
  label?: string;
  size?: ControlSize;
  disabled?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
};

/** 可读写的滚动偏移 — 传 Reanimated `SharedValue<number>`。 */
export type EgNavBarScrollOffset = { value: number };

export type EgNavBarProps = {
  /**
   * 中间标题 — 17 / 600（body-medium-strong），单行截断。
   * iOS 26+ 系统栏：`title` 不可为空串（否则 scroll edge 背景失效）；`showTitle: false` 时仍传真实文案，由 EDS 透明隐藏。
   */
  title?: string;
  /** 左操作；缺省为返回（`eds-arrow-left-ios`）。 */
  left?: EgNavBarAction;
  right?: EgNavBarAction;
  showLeft?: boolean;
  /** iOS 26+：仅控制标题可见性，不删 `title`（须非空以保留 scroll edge）。 */
  showTitle?: boolean;
  showRight?: boolean;
  /** 背景（`glass-mask-box`），贯穿状态栏区。默认 `auto`。 */
  background?: EgNavBarBackground;
  /** `background="auto"` — 列表滚动偏移（`useEgNavBarScroll().scrollOffset`）。 */
  scrollOffset?: EgNavBarScrollOffset;
  /** `background="auto"` 且无 `scrollOffset` 时 — 手动告知栏下是否有内容。 */
  contentUnder?: boolean;
  /** 状态栏区高度；缺省 `useSafeAreaInsets().top`（不写死 20）。 */
  topInset?: number;
  /** 渲染 `StatusBar`（Android 透明 + 沉浸，避免状态栏一片黑）。默认 `true`。 */
  manageStatusBar?: boolean;
  mode?: ThemeMode;
  testID?: string;
  /**
   * Tab 根页等无 Stack 系统栏时 — iOS 26+ 仍绘制 RN 栏（不触发 native bypass）。
   * Stack 内页请用 `egNavBarNativeStackOptions`，勿设此项。
   */
  forceRnImplementation?: boolean;
  style?: ViewStyle;
};
