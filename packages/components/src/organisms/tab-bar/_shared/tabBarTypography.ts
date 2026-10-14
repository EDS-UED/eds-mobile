import type { TextStyle } from 'react-native';
import { mobileTheme } from '../../../theme/index.js';
import { edsFontStyle } from '../../../shared/fontFamily.js';

const base = mobileTheme.typography.base;

export function tabBarLabelTypography(selected: boolean): TextStyle {
  const weightKey = selected ? 'weight-semibold' : 'weight-medium';
  return {
    fontSize: base['size-bar'] as number,
    lineHeight: base['line-height-bar'] as number,
    ...edsFontStyle(String(base[weightKey]) as TextStyle['fontWeight']),
  };
}
