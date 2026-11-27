import mobileTheme from '@eds/mobile-tokens/theme';

/**
 * Showcase 尺寸档标签：`md 48`。
 * 数值来自 token（间距 / scale / 字号），同一档名在不同组件上不是同一个数。
 */

const spacing = mobileTheme.spacing;
const scale = mobileTheme.scale;
const typeBase = mobileTheme.typography.base;

function num(map: Record<string, number | string>, key: string): number {
  const value = map[key];
  return typeof value === 'number' ? value : Number(value);
}

function spacingPx(token: string): number {
  return num(spacing, token);
}

function scalePx(token: string): number {
  const unit = num(scale, 'scale-1');
  const base = unit > 0 ? spacingPx('spacing-1') / unit : 4;
  return num(scale, token) * base;
}

function labeled<T extends string>(value: T, amount: number): { value: T; label: string } {
  return { value, label: `${value} ${amount}` };
}

const CONTROL = ['xl', 'lg', 'md', 'sm', 'xs'] as const;
const LG_TO_XS = ['lg', 'md', 'sm', 'xs'] as const;
const LG_TO_SM = ['lg', 'md', 'sm'] as const;

/** 输入 / 下拉 · `input-*`（与 `dropdown-*` 同值）。 */
export const SHOWCASE_INPUT_SIZE_OPTIONS = CONTROL.map((value) =>
  labeled(value, spacingPx(`input-${value}`)),
);

/** 按钮高度 · `button-*`。 */
export const SHOWCASE_BUTTON_SIZE_OPTIONS_LG_TO_XS = LG_TO_XS.map((value) =>
  labeled(value, spacingPx(`button-${value}`)),
);

/** Tag 高度 · `tag-*`。 */
export const SHOWCASE_TAG_SIZE_OPTIONS = LG_TO_SM.map((value) =>
  labeled(value, spacingPx(`tag-${value}`)),
);

/** Switch / Checkbox / Radio 边长 · `switch-*`（与 checkbox / radio 同值）。 */
export const SHOWCASE_TOGGLE_SIZE_OPTIONS = LG_TO_SM.map((value) =>
  labeled(value, spacingPx(`switch-${value}`)),
);

/** 玻璃文本胶囊 · 字行高 + 上下内边距，与 `resolveEgGlassCapsuleTextShellStyle` 一致。 */
export const SHOWCASE_GLASS_TEXT_SIZE_OPTIONS = LG_TO_XS.map((value) => {
  const line =
    value === 'lg'
      ? num(typeBase, 'line-height-body-medium')
      : num(typeBase, 'line-height-body-small');
  const pad =
    value === 'lg'
      ? spacingPx('spacing-4')
      : value === 'md'
        ? spacingPx('spacing-2-5')
        : value === 'sm'
          ? spacingPx('spacing-2')
          : spacingPx('spacing-1');
  return labeled(value, line + pad * 2);
});

/** 图标按钮容器 · `scale-14` … `scale-7`。 */
const SYMBOL_ACTION_SCALE = {
  xl: 'scale-14',
  lg: 'scale-13',
  md: 'scale-11',
  sm: 'scale-9',
  xs: 'scale-7',
} as const;

export const SHOWCASE_SYMBOL_ACTION_SIZE_OPTIONS = CONTROL.map((value) =>
  labeled(value, scalePx(SYMBOL_ACTION_SCALE[value])),
);

/** Menu 图标胶囊实际边长 · `spacing-10` + `spacing-1`。 */
const MENU_CAPSULE_PX = spacingPx('spacing-10') + spacingPx('spacing-1');

export const SHOWCASE_MENU_CAPSULE_SIZE_OPTIONS = CONTROL.map((value) =>
  labeled(value, MENU_CAPSULE_PX),
);

/** 链接字号 · lg body-medium · md body-small · sm detail。 */
export const SHOWCASE_LINK_SIZE_OPTIONS = [
  labeled('lg', num(typeBase, 'size-body-medium')),
  labeled('md', num(typeBase, 'size-body-small')),
  labeled('sm', num(typeBase, 'size-detail')),
] as const;

/** 分段轨道高度 · 与 `egSegmentedControlTrackMinHeight` 同式。 */
export const SHOWCASE_SEGMENTED_SIZE_OPTIONS = LG_TO_SM.map((value) => {
  const inset = spacingPx('spacing-05');
  const line = num(typeBase, 'line-height-footnote');
  const pad =
    value === 'lg'
      ? spacingPx('spacing-2')
      : value === 'md'
        ? spacingPx('spacing-1')
        : spacingPx('spacing-05');
  return labeled(value, inset * 2 + pad * 2 + line);
});

/** 仍被输入类文档引用的别名。 */
export const SHOWCASE_SIZE_OPTIONS_XL_TO_XS = SHOWCASE_INPUT_SIZE_OPTIONS;

export const SHOWCASE_SIZE_OPTIONS_LG_TO_XS = SHOWCASE_BUTTON_SIZE_OPTIONS_LG_TO_XS;

export const SHOWCASE_SIZE_OPTIONS_LG_TO_SM = SHOWCASE_TAG_SIZE_OPTIONS;

/** EgSymbol · `symbol-*`。 */
export const SHOWCASE_SYMBOL_SIZE_OPTIONS = (['xs', 'sm', 'md', 'lg'] as const).map((value) =>
  labeled(value, spacingPx(`symbol-${value}`)),
);

export const SHOWCASE_SIZE_OPTIONS_SM_TO_LG = (['sm', 'md', 'lg'] as const).map((value) =>
  labeled(value, spacingPx(`button-${value}`)),
);

/** EgAvatar · `avatar-*`。 */
export const SHOWCASE_AVATAR_SIZE_OPTIONS = (
  ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'] as const
).map((value) => labeled(value, spacingPx(`avatar-${value}`)));

export const SHOWCASE_AVATAR_SIZE_OPTIONS_TO_2XL = SHOWCASE_AVATAR_SIZE_OPTIONS.slice(0, 6);

/** 页面顶边距档 · 与 `EG_PAGE_CONTENT_PADDING_TOP_PRESETS` 同值。 */
export const SHOWCASE_PAGE_PADDING_PRESET_SIZE_OPTIONS = (
  [
    ['xs', 'spacing-0'],
    ['sm', 'spacing-1'],
    ['md', 'spacing-2'],
    ['lg', 'spacing-3'],
    ['xl', 'spacing-4'],
    ['2xl', 'spacing-5'],
  ] as const
).map(([value, token]) => labeled(value, spacingPx(token)));

export const SHOWCASE_SHEETS_DETENT_SIZE_OPTIONS = [
  { value: 'small', label: 'sm 28%' },
  { value: 'medium', label: 'md 50%' },
  { value: 'large', label: `lg ${spacingPx('spacing-0')}` },
] as const;

export const SHOWCASE_MOTION_PRESS_INTENSITY_OPTIONS = (['xs', 'sm', 'md', 'lg'] as const).map(
  (value) => labeled(value, mobileTheme.motion.scale[`scale-press-${value}`] as number),
);
