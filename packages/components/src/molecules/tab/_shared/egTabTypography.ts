import type { TextStyle } from 'react-native';

import { mobileTheme } from '../../../theme/index.js';
import { edsFontStyle } from '../../../shared/fontFamily.js';

const base = mobileTheme.typography.base;

/** Figma Tabs · 选中 / 未选均为 Body Medium Strong。 */
export function egTabLabelTypography(): TextStyle {
  return {
    fontSize: base['size-body-medium'] as number,
    lineHeight: base['line-height-body-medium'] as number,
    ...edsFontStyle(String(base['weight-medium']) as TextStyle['fontWeight']),
  };
}

/** Figma Segmented Control · Footnote（13 / 16 · `weight-medium` 500）。 */
export function egSegmentedControlLabelTypography(): Pick<TextStyle, 'fontSize' | 'lineHeight'> {
  return {
    fontSize: base['size-footnote'] as number,
    lineHeight: base['line-height-footnote'] as number,
  };
}

export function egSegmentedControlLabelWeight(): TextStyle['fontWeight'] {
  return String(base['weight-medium']) as TextStyle['fontWeight'];
}
