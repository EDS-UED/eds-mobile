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

/** Figma Segmented Control · Footnote Strong（13 / medium）。 */
export function egSegmentedControlLabelTypography(): TextStyle {
  return {
    fontSize: base['size-footnote'] as number,
    lineHeight: base['line-height-footnote'] as number,
    ...edsFontStyle(String(base['weight-medium']) as TextStyle['fontWeight']),
  };
}
