import type { EgCommonProps } from '../../../shared/types.js';

/** Figma: Divider · Module / Page */
export type EgDividerVariant = 'module' | 'page';

/** Figma: Divider · 水平 / 垂直 */
export type EgDividerOrientation = 'horizontal' | 'vertical';

/** Figma: Divider 分割线✅ */
export type EgDividerProps = EgCommonProps & {
  /** Module / Page 线宽均为 `stroke-xs`；色 `stroke-divider-module` / `stroke-divider-page`。默认 `page`。 */
  variant?: EgDividerVariant;
  /** 水平或垂直。默认 `horizontal`。 */
  orientation?: EgDividerOrientation;
  /** 显示分割线；默认 `true`。 */
  visible?: boolean;
  /**
   * 长轴长度（px）— 水平为宽、垂直为高。
   * 未设时水平 `width: '100%'`；垂直用默认预览长度。
   */
  length?: number;
};
