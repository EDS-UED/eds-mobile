/** Showcase Customize — 尺寸档位标签统一 XL / LG / MD / SM / XS（禁中文）。 */

export const SHOWCASE_SIZE_OPTIONS_XL_TO_XS = [
  { value: 'xl', label: 'XL' },
  { value: 'lg', label: 'LG' },
  { value: 'md', label: 'MD' },
  { value: 'sm', label: 'SM' },
  { value: 'xs', label: 'XS' },
] as const;

export const SHOWCASE_SIZE_OPTIONS_LG_TO_XS = [
  { value: 'lg', label: 'LG' },
  { value: 'md', label: 'MD' },
  { value: 'sm', label: 'SM' },
  { value: 'xs', label: 'XS' },
] as const;

export const SHOWCASE_SIZE_OPTIONS_LG_TO_SM = [
  { value: 'lg', label: 'LG' },
  { value: 'md', label: 'MD' },
  { value: 'sm', label: 'SM' },
] as const;

/** EgSymbol · symbol-xs … symbol-lg */
export const SHOWCASE_SYMBOL_SIZE_OPTIONS = [
  { value: 'xs', label: 'XS' },
  { value: 'sm', label: 'SM' },
  { value: 'md', label: 'MD' },
  { value: 'lg', label: 'LG' },
] as const;

export const SHOWCASE_SIZE_OPTIONS_SM_TO_LG = [
  { value: 'sm', label: 'SM' },
  { value: 'md', label: 'MD' },
  { value: 'lg', label: 'LG' },
] as const;

/** EgAvatar · avatar-xs … avatar-5xl */
export const SHOWCASE_AVATAR_SIZE_OPTIONS = [
  { value: 'xs', label: 'XS' },
  { value: 'sm', label: 'SM' },
  { value: 'md', label: 'MD' },
  { value: 'lg', label: 'LG' },
  { value: 'xl', label: 'XL' },
  { value: '2xl', label: '2XL' },
  { value: '3xl', label: '3XL' },
  { value: '4xl', label: '4XL' },
  { value: '5xl', label: '5XL' },
] as const;

export const SHOWCASE_AVATAR_SIZE_OPTIONS_TO_2XL = SHOWCASE_AVATAR_SIZE_OPTIONS.slice(0, 6);

export const SHOWCASE_PAGE_PADDING_PRESET_SIZE_OPTIONS = [
  { value: 'xs', label: 'XS' },
  { value: 'sm', label: 'SM' },
  { value: 'md', label: 'MD' },
  { value: 'lg', label: 'LG' },
  { value: 'xl', label: 'XL' },
  { value: '2xl', label: '2XL' },
] as const;

export const SHOWCASE_SHEETS_DETENT_SIZE_OPTIONS = [
  { value: 'small', label: 'SM' },
  { value: 'medium', label: 'MD' },
  { value: 'large', label: 'LG' },
] as const;

export const SHOWCASE_MOTION_PRESS_INTENSITY_OPTIONS = [
  { value: 'xs', label: 'XS' },
  { value: 'sm', label: 'SM' },
  { value: 'md', label: 'MD' },
  { value: 'lg', label: 'LG' },
] as const;