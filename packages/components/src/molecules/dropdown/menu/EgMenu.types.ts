import type { ReactNode } from 'react';

import type { EgSymbolProps } from '../../../atoms/_shared/symbol/EgSymbol.js';
import type { ControlSize, EgCommonProps } from '../../../shared/types.js';
import type { ThemeMode } from '../../../theme/index.js';

export type EgMenuTriggerContext = {
  open: () => void;
  disabled: boolean;
};

export type EgMenuPlacement = 'top' | 'bottom';
export type EgMenuAlign = 'start' | 'center' | 'end';

export type EgMenuItem = {
  id: string;
  label: string;
  icon?: EgSymbolProps['name'];
  destructive?: boolean;
  disabled?: boolean;
};

export type EgMenuSection = {
  title?: string;
  items: EgMenuItem[];
};

export type EgMenuProps = EgCommonProps & {
  sections?: EgMenuSection[];
  items?: EgMenuItem[];
  trigger?: ReactNode | ((ctx: EgMenuTriggerContext) => ReactNode);
  triggerIcon?: string;
  selectedId?: string;
  defaultSelectedId?: string;
  onSelect?: (id: string, item: EgMenuItem) => void;
  size?: ControlSize;
  disabled?: boolean;
  mode?: ThemeMode;
  forceRnImplementation?: boolean;
  /**
   * `bottom` — 顶边相对触发器上缘外扩 spacing-1；`top` — 底边相对触发器下缘外扩 spacing-1。
   * 水平：start 左外扩、end 右外扩、center 仅垂直外扩。
   */
  placement?: EgMenuPlacement;
  /** 水平对齐 — start / center / end（左 / 中 / 右）。 */
  align?: EgMenuAlign;
  /** 浮层宽度（px）— 默认 268。 */
  menuWidth?: number;
  /** 浮层最大高度（px）— 内容自适应，默认 580。 */
  menuMaxHeight?: number;
};
