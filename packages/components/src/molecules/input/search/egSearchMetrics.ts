import { inputHeight } from '../../../shared/controlMetrics.js';
import { mobileTheme } from '../../../theme/index.js';

const spacing = mobileTheme.spacing;

/** Search 唯一尺寸档 · `input-md`（48px）。 */
export const EG_SEARCH_FIELD_HEIGHT = inputHeight('md');

/** 搜索图标 · `symbol-sm`（20px）。 */
export const EG_SEARCH_ICON_SIZE = spacing['symbol-sm'] as number;

/** 搜索条与右侧关闭胶囊间距 · `spacing-2-5`（10px）。 */
export const EG_SEARCH_CLOSE_GAP = spacing['spacing-2-5'] as number;

/** 默认外边距 · 上 · `spacing-6`（24px）。 */
export const EG_SEARCH_MARGIN_TOP = spacing['spacing-6'] as number;

/** 默认外边距 · 下 · `spacing-6`（24px）。 */
export const EG_SEARCH_MARGIN_BOTTOM = spacing['spacing-6'] as number;

/** 默认外边距 · 右 · `spacing-6`（24px）。 */
export const EG_SEARCH_MARGIN_RIGHT = spacing['spacing-6'] as number;