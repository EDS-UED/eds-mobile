import { mobileTheme } from '../../../../theme/index.js';

/** Figma Menu 浮层默认宽 — 待 scale spec 收敛后可换 token。 */
export const EG_MENU_DEFAULT_WIDTH_PX = 268;

/** Menu 行间距 — spacing-0（0px）。 */
export function egMenuItemRowGapPx(): number {
  return mobileTheme.spacing['spacing-0'] as number;
}

/** Item 上下 — spacing-2-5（10px）。 */
export function egMenuItemPaddingVerticalPx(): number {
  return mobileTheme.spacing['spacing-2-5'] as number;
}

/** Item 左 — spacing-4（16px）。 */
export function egMenuItemPaddingStartPx(): number {
  return mobileTheme.spacing['spacing-4'] as number;
}

/** Item 右 — spacing-4（16px）。 */
export function egMenuItemPaddingEndPx(): number {
  return mobileTheme.spacing['spacing-4'] as number;
}

/** 浮层整体最大高度（含 glass 内边距）。 */
export const EG_MENU_DEFAULT_MAX_HEIGHT_PX = 580;

export function egMenuContainerPaddingPx(): number {
  return mobileTheme.spacing['spacing-2-5'] as number;
}

/** 浮层容器左右 inset — spacing-2-5（10px）。 */
export function egMenuContainerPaddingHorizontalPx(): number {
  return egMenuContainerPaddingPx();
}

/** 浮层容器上下 inset — spacing-2-5（10px）。 */
export function egMenuContainerPaddingVerticalPx(): number {
  return egMenuContainerPaddingPx();
}

/** Icon ↔ 文案 — spacing-3（12px） */
export function egMenuItemIconLabelGapPx(): number {
  return mobileTheme.spacing['spacing-3'] as number;
}

/** 组 ↔ 分割线 ↔ 组 — spacing-2-5（10px） */
export function egMenuSectionGapPx(): number {
  return mobileTheme.spacing['spacing-2-5'] as number;
}

/** 组标题左 inset — 与 item 左右 padding 对齐 · spacing-4（16px） */
export function egMenuSectionTitlePaddingStartPx(): number {
  return mobileTheme.spacing['spacing-4'] as number;
}

/** 组标题色 — text-base-tertiary · eds-base 40% */
export function egMenuSectionTitleColorToken(): 'text-base-tertiary' {
  return 'text-base-tertiary';
}

/** 组标题上 — 与 item 上下 padding 同 rhythm · spacing-2-5（10px） */
export function egMenuSectionTitlePaddingTopPx(): number {
  return mobileTheme.spacing['spacing-2-5'] as number;
}

/** 组标题下 ↔ 首条 item — spacing-2-5（10px） */
export function egMenuSectionTitlePaddingBottomPx(): number {
  return mobileTheme.spacing['spacing-2-5'] as number;
}

/** 选中行强调 — event-focus-brand（聚焦语义底） */
export function egMenuItemSelectedBackgroundColorToken(): 'event-focus-brand' {
  return 'event-focus-brand';
}

/** 分割线左右 inset — var(--spacing-4) · 16px */
export function egMenuDividerInsetPx(): number {
  return mobileTheme.spacing['spacing-4'] as number;
}

/** 浮层相对触发器对齐边外扩 — var(--spacing-1) · 4px（定位用负向 -4）。 */
export function egMenuTriggerGapPx(): number {
  return mobileTheme.spacing['spacing-1'] as number;
}

/** 浮层距屏幕边缘 — var(--spacing-2-5) · 10px。 */
export function egMenuEdgeInsetPx(): number {
  return mobileTheme.spacing['spacing-2-5'] as number;
}

export function resolveEgMenuMaxScrollHeight(menuMaxHeight: number): number {
  const containerPad = egMenuContainerPaddingPx();
  return Math.max(120, menuMaxHeight - containerPad * 2);
}
