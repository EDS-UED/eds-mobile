import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { ThemeMode } from '../../theme/index.js';
import type { EgNavBarScrollEdgeEffect } from '../tab-bar/nav-bar/EgNavBar.types.js';

/**
 * 档位 · small 28% / medium 50% 屏高；
 * `adaptive` = 顶栏 + 内容高度（上限同 large）；
 * large = 屏高 − safe area top − `motion-offset-sheets-top`（spacing-0 · 紧贴系统条底）。
 */
export type EgSheetsDetent = 'small' | 'medium' | 'large' | 'adaptive';

export type EgSheetsProps = {
  visible: boolean;
  /** 收起动画结束后回调（关闭按钮 / 遮罩 / 下拉 / 系统返回 / 外部 `visible=false`）。 */
  onDismiss: () => void;
  /** 可停靠档位，按高度升序去重；默认 `['medium', 'large']`（小档需显式开启）。 */
  detents?: readonly EgSheetsDetent[];
  /** 打开时档位；默认 `'medium'`（不在 detents 内则取 `detents[0]`）。 */
  initialDetent?: EgSheetsDetent;
  /** 受控档位 · 变化时以 sheets-detent 弹簧吸附；拖拽落位经 `onDetentChange` 回传。 */
  detent?: EgSheetsDetent;
  onDetentChange?: (detent: EgSheetsDetent) => void;
  /** 顶部 EgNavBar 标题。 */
  title?: string;
  showTitle?: boolean;
  /**
   * 顶部左侧按钮 · EDS 锁定为返回（`eds-arrow-left-ios`），业务侧禁止修改 / 替换，仅可显隐。
   * 默认隐藏。
   */
  showLeft?: boolean;
  /** 左侧返回按钮点击回调（按钮样式与图标不可定制）。 */
  onBack?: () => void;
  /**
   * 顶部右侧按钮 · EDS 锁定为关闭（`eds-close`，点击走 sheets 收起），业务侧禁止修改 / 替换，仅可显隐。
   * 默认显示。
   */
  showRight?: boolean;
  /** 遮罩点击 / 下拉 / 系统返回可收起；关闭按钮不受影响。 */
  dismissible?: boolean;
  /**
   * iOS 26+ 顶栏背景（`glass-mask-box` 原生 scroll edge effect）滚动时的样式；默认 `soft`。
   * 静止（内容未滚入栏下）恒为 `hidden`。
   * Android · iOS ≤25 不生效（RN mask）。
   */
  scrollEdgeEffect?: EgNavBarScrollEdgeEffect;
  mode?: ThemeMode;
  /** 内容插槽 ScrollView 的 contentContainerStyle（默认左右 / 底部 spacing-5）。 */
  contentStyle?: StyleProp<ViewStyle>;
  /** 内容插槽 · 渲染于顶栏下方的滚动区；最高档可滚动，`adaptive` 档按其高度定档。 */
  children?: ReactNode;
  /**
   * 底部 action 插槽 · 始终贴当前档位可视底边。
   * 缺省为一个通栏 `EgBrandButton`「确认」（点击收起）；传入即整块替换，按钮数量 / 样式 / 组合由业务自定义。
   */
  actions?: ReactNode;
  /** 显示底部 action 插槽；默认 `true`。 */
  showActions?: boolean;
  testID?: string;
};
