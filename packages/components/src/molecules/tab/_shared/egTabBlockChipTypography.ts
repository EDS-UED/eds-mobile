import type { TextStyle } from 'react-native';

import { mobileTheme } from '../../../theme/index.js';
import { edsFontStyle } from '../../../shared/fontFamily.js';

const base = mobileTheme.typography.base;

export function egTabBlockChipLabelTypography(selected: boolean): TextStyle {
  return {
    fontSize: base['size-body-small'] as number,
    lineHeight: base['line-height-body-small'] as number,
    ...edsFontStyle(
      String(selected ? base['weight-semibold'] : base['weight-regular']) as TextStyle['fontWeight'],
    ),
  };
}
