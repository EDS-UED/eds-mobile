import { StyleSheet, type TextStyle } from 'react-native';

import {
  presetBodyMediumHeavy,
  presetBodyMediumStrong,
  presetBodySmallStrong,
} from '../../shared/typographyStyles.js';
import { mobileTheme } from '../../theme/index.js';
import { edsFontStyle } from '../../shared/fontFamily.js';

export type EgDataListPrimaryWeight = 'normal' | 'medium' | 'heavy';

const base = mobileTheme.typography.base;

export function egDataListPrimaryTextFontWeight(
  weight: EgDataListPrimaryWeight = 'heavy',
): TextStyle['fontWeight'] {
  switch (weight) {
    case 'normal':
      return String(base['weight-regular']) as TextStyle['fontWeight'];
    case 'medium':
      return String(base['weight-medium']) as TextStyle['fontWeight'];
    case 'heavy':
    default:
      return String(base['weight-semibold']) as TextStyle['fontWeight'];
  }
}

export function egDataListSubTextFontWeight(): TextStyle['fontWeight'] {
  return String(base['weight-regular']) as TextStyle['fontWeight'];
}

export function egDataListSubTextSegmentAFontWeight(): TextStyle['fontWeight'] {
  return String(base['weight-medium']) as TextStyle['fontWeight'];
}

/** 主/副文本共用行盒 · 字重由 {@link EdsSansText} `weight` 解析 bundled face。 */
export function egDataListPrimaryTextLayout(): Pick<TextStyle, 'fontSize' | 'lineHeight'> {
  return {
    fontSize: base['size-body-medium'] as number,
    lineHeight: base['line-height-body-medium'] as number,
  };
}

/** 主文本行盒高度 · 与 {@link egDataListPrimaryTextLayout} `lineHeight` 一致。 */
export function egDataListPrimaryLineHeight(): number {
  return base['line-height-body-medium'] as number;
}

export function egDataListSubTextLayout(): Pick<TextStyle, 'fontSize' | 'lineHeight'> {
  return {
    fontSize: base['size-body-small'] as number,
    lineHeight: base['line-height-body-small'] as number,
  };
}

function bodyMediumRegular(): TextStyle {
  return {
    fontSize: base['size-body-medium'] as number,
    lineHeight: base['line-height-body-medium'] as number,
    ...edsFontStyle(String(base['weight-regular'])),
  };
}

const BODY_SMALL = {
  fontSize: base['size-body-small'] as number,
  lineHeight: base['line-height-body-small'] as number,
  ...edsFontStyle(String(base['weight-regular'])),
} satisfies TextStyle;

/** 主文本 · typography-body-medium / -strong / -heavy。 */
export function egDataListPrimaryTextStyle(weight: EgDataListPrimaryWeight = 'heavy'): TextStyle {
  switch (weight) {
    case 'normal':
      return bodyMediumRegular();
    case 'medium':
      return presetBodyMediumStrong();
    case 'heavy':
    default:
      return presetBodyMediumHeavy();
  }
}

/** 副文本正文 · typography-body-small。 */
export function egDataListSubTextStyle(): TextStyle {
  return BODY_SMALL;
}

/** 副文本片段 A 加粗 · typography-body-small-strong。 */
export function egDataListSubTextSegmentAStyle(): TextStyle {
  return presetBodySmallStrong();
}

export function flattenEgDataListTextStyle(
  baseStyle: TextStyle,
  color: string,
  extra?: TextStyle,
): TextStyle {
  return StyleSheet.flatten([baseStyle, { color }, extra]) as TextStyle;
}