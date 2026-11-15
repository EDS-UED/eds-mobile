import type { ViewStyle } from 'react-native';
import type { EgScrollEdgeEffectStyle } from '../../../atoms/glass/EgScrollEdgeEffect.js';
import type { EgButtonGlassIconCount } from '../../../molecules/button/button-glass/EgButtonGlass.types.js';
import type { ControlSize } from '../../../shared/types.js';
import type { ThemeMode } from '../../../theme/index.js';

/**
 * - `auto`：下方无内容时隐藏，内容滚入栏下时显示（iOS scroll edge appearance）。
 * - `visible` / `hidden`：手动常显 / 常隐。
 */
export type EgNavBarBackground = 'auto' | 'visible' | 'hidden';

/**
 * 顶栏 scroll edge 样式（iOS 26 `scrollEdgeEffectStyle` 同名）：
 * `soft` 轻模糊 + 渐变淡出至透明 · `hard` 轻模糊 + 渐变更不透明 + 底线 · `hidden` 无 · `automatic` 页面 soft / Sheet hard。
 * iOS 26+ 系统栏由 UIKit 绘制；RN 栏由 `GlassMaskBackdrop`（iOS 26 以下 / Android 遮罩浅）绘制。
 */
export type EgNavBarScrollEdgeEffect = EgScrollEdgeEffectStyle;

/**
 * - `center`：居中标题 · Body Medium Strong（页面栏）。
 * - `leading`：标题靠左 · Title（Sheet 顶栏）；间距见 `leadingTitleGap` / `leadingTitleInset`。
 */
export type EgNavBarTitleAlign = 'center' | 'leading';

/** 左 / 右操作 — 默认 icon 胶囊（`EgButtonGlass kind="icon"`）。 */
export type EgNavBarAction = {
  kind?: 'icon' | 'text';
  icon?: string;
  iconCount?: EgButtonGlassIconCount;
  /** `iconCount={2}` 时默认 `split`（两颗独立玻璃钮）；`combined` 为单胶囊双 icon。 */
  iconLayout?: 'combined' | 'split';
  iconAlt?: string;
  label?: string;
  size?: ControlSize;
  disabled?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
};

/** 可读写的滚动偏移 — 传 Reanimated `SharedValue<number>`。 */
export type EgNavBarScrollOffset = { value: number };

/**
 * - `stack`（默认）：iOS 26+ 由系统 `UINavigationBar` 承载（`egNavBarNativeStackOptions`），本组件不绘制。
 * - `overlay`：Modal / Sheet 等无 Stack 场景 — RN 栏，缺省滚入 soft（iOS 26 以下遮罩浅 · Android 遮罩深）。
 */
export type EgNavBarChromeContext = 'stack' | 'overlay';

export type EgNavBarSlotTransition = 'fade' | 'layout';

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
  /** 标题布局；默认 `center`。`leading` 仅 RN 栏生效（`forceRnImplementation` / Android / iOS ≤25）。 */
  titleAlign?: EgNavBarTitleAlign;
  /** `titleAlign="leading"` 且无左操作 — 标题距行内容起点（默认 `spacing-2` / 8px）。 */
  leadingTitleInset?: number;
  /** `titleAlign="leading"` 且有左操作 — 标题与左操作间距（默认 `spacing-1` / 4px）。 */
  leadingTitleGap?: number;
  /** 覆盖行左右内边距；缺省 `EG_NAV_BAR_PADDING_HORIZONTAL`。 */
  contentPaddingHorizontal?: number;
  /** 覆盖行上内边距；缺省 `EG_NAV_BAR_PADDING_TOP`。 */
  contentPaddingTop?: number;
  /** 覆盖行下内边距；缺省 `EG_NAV_BAR_PADDING_BOTTOM`。 */
  contentPaddingBottom?: number;
  showRight?: boolean;
  /**
   * 宿主以 transform 外扩时的左右内容偏移（px，`SharedValue<number>`）：左操作 / 靠左标题左移、右操作右移，
   * 不触发布局。EgSheets 浮动 → 贴边使用。
   */
  edgeShift?: EgNavBarScrollOffset;
  /** 背景显隐（scroll edge），贯穿状态栏区。默认 `auto`。 */
  background?: EgNavBarBackground;
  /**
   * scroll edge 样式；缺省按 `background` 映射（iOS 26+ / 页面：auto→静止 hidden · 滚入栏下 soft · visible→soft · hidden→hidden）。
   * 系统栏与 RN 栏同义；缺省滚入为 soft（页面 / Sheet 同）；显式 `automatic` 在 Sheet 下解析为 hard。
   */
  scrollEdgeEffect?: EgNavBarScrollEdgeEffect;
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
  /** 顶栏宿主；EgSheets 等浮层传 `overlay`。默认 `stack`。 */
  chromeContext?: EgNavBarChromeContext;
  /**
   * 左 / 右操作显隐、右操作内容切换时的过渡（仅 RN 栏）。
   * - `fade`（默认）：槽位原地淡入淡出。
   * - `layout`：layout-deform-content — 操作 crossfade + 缩放，靠左标题与胶囊宽度随布局平移（EgSheets）。
   */
  slotTransition?: EgNavBarSlotTransition;
  /**
   * 已废弃于 iOS 26+ `stack` — 系统栏不可再强制 RN；请用 `egNavBarNativeStackOptions`。
   * 仅作兼容入参（无效果）；Modal / Sheet 等用 `chromeContext="overlay"`。
   */
  forceRnImplementation?: boolean;
  style?: ViewStyle;
};
