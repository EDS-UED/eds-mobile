import type { TextStyle } from 'react-native';
import { mobileTheme } from '../theme/index.js';
import { edsFontStyle } from './fontFamily.js';
import type { ControlSize, TagSize, ToggleSize } from './types.js';

const base = mobileTheme.typography.base;

type TextPreset = Pick<TextStyle, 'fontSize' | 'lineHeight' | 'fontWeight' | 'fontFamily'>;

function preset(sizeKey: keyof typeof base, lineKey: keyof typeof base, weightKey: keyof typeof base): TextPreset {
  return {
    fontSize: base[sizeKey] as number,
    lineHeight: base[lineKey] as number,
    ...edsFontStyle(String(base[weightKey]) as TextStyle['fontWeight']),
  };
}

const BODY_MEDIUM_STRONG = preset('size-body-medium', 'line-height-body-medium', 'weight-semibold');
const BODY_SMALL_STRONG = preset('size-body-small', 'line-height-body-small', 'weight-semibold');

export function presetBodyMediumStrong(): TextPreset {
  return BODY_MEDIUM_STRONG;
}

export function presetBodySmallStrong(): TextPreset {
  return BODY_SMALL_STRONG;
}
const BODY_SMALL = preset('size-body-small', 'line-height-body-small', 'weight-regular');
const FOOTNOTE_STRONG = preset('size-footnote', 'line-height-footnote', 'weight-semibold');
const DETAIL_STRONG = preset('size-detail', 'line-height-detail', 'weight-semibold');

/** LG · MD：17 / 600；SM · XS：15 / 600（typography base token）。 */
export function buttonTypography(size: ControlSize): TextPreset {
  switch (size) {
    case 'xl':
    case 'lg':
    case 'md':
      return BODY_MEDIUM_STRONG;
    case 'sm':
    case 'xs':
    default:
      return BODY_SMALL_STRONG;
  }
}

export function fieldTypography(size: ControlSize): TextPreset {
  switch (size) {
    case 'xl':
    case 'lg':
      return preset('size-body-medium', 'line-height-body-medium', 'weight-regular');
    case 'md':
      return BODY_SMALL;
    case 'sm':
    case 'xs':
    default:
      return preset('size-body-small', 'line-height-body-small', 'weight-regular');
  }
}

/** Figma Search — Body Medium Strong at md, Body Small Strong at sm/xs. */
export function searchFieldTypography(size: ControlSize): TextPreset {
  switch (size) {
    case 'xl':
    case 'lg':
    case 'md':
      return BODY_MEDIUM_STRONG;
    case 'sm':
    case 'xs':
    default:
      return BODY_SMALL_STRONG;
  }
}

export function linkTypography(size: Extract<ControlSize, 'lg' | 'md' | 'sm'>): TextPreset {
  switch (size) {
    case 'lg':
      return BODY_MEDIUM_STRONG;
    case 'md':
      return BODY_SMALL_STRONG;
    case 'sm':
    default:
      return DETAIL_STRONG;
  }
}

export function tagTypography(size: TagSize): TextPreset {
  switch (size) {
    case 'lg':
      return DETAIL_STRONG;
    case 'md':
      return FOOTNOTE_STRONG;
    case 'sm':
    default:
      return preset('size-bar', 'line-height-bar', 'weight-medium');
  }
}

/** Checkbox / Decide mark — Bar at sm, toggle-mark-md at md/lg. */
export function toggleMarkTypography(size: ToggleSize): Pick<TextPreset, 'fontSize' | 'lineHeight'> {
  if (size === 'sm') {
    return {
      fontSize: base['size-bar'] as number,
      lineHeight: base['line-height-bar'] as number,
    };
  }
  return {
    fontSize: base['size-toggle-mark-md'] as number,
    lineHeight: base['line-height-toggle-mark-md'] as number,
  };
}
