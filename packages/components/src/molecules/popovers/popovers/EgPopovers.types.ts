import type { ReactNode } from 'react';

import type { ThemeMode } from '../../../theme/index.js';
import type { PopoverSize } from '../_shared/popoverShape.js';

/** Figma Popovers 1453:1038 · 箭头贴边的 12 个位置。 */
export type EgPopoversEdge =
  | 'top-leading'
  | 'top-center'
  | 'top-trailing'
  | 'leading-top'
  | 'leading-middle'
  | 'leading-bottom'
  | 'trailing-top'
  | 'trailing-middle'
  | 'trailing-bottom'
  | 'bottom-leading'
  | 'bottom-center'
  | 'bottom-trailing';

export type EgPopoversProps = {
  mode?: ThemeMode;
  /** 默认与 Figma 组件集一致：Leading (Top)。 */
  edge?: EgPopoversEdge;
  /** 内容插槽；与 `children` 等价，优先 `slot`。 */
  slot?: ReactNode;
  children?: ReactNode;
  /** 面板最小尺寸；默认 `compact` 随内容增高增宽。 */
  size?: PopoverSize;
  testID?: string;
};