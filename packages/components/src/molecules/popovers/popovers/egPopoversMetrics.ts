import type { GlassBoxClassName } from '../../../atoms/glass/resolveGlassBox.js';
import { mobileTheme } from '../../../theme/index.js';

const spacing = mobileTheme.spacing;

/** Popover 容器 · 与 {@link EgMenu} 相同 `glass-menu-box`。 */
export const EG_POPOVERS_MENU_BOX = 'glass-menu-box' as const satisfies GlassBoxClassName;

/** 内容插槽默认内边距 · `spacing-3`（12px）。 */
export const EG_POPOVERS_SLOT_PADDING = spacing['spacing-3'] as number;