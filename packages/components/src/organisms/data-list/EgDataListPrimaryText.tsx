import { StyleSheet, type TextProps } from 'react-native';

import { EdsSansText } from '../../shared/EdsSansText.js';
import { getThemeColors } from '../../theme/index.js';
import {
  egDataListPrimaryTextFontWeight,
  egDataListPrimaryTextLayout,
  flattenEgDataListTextStyle,
  type EgDataListPrimaryWeight,
} from './egDataListTypography.js';
import type { ThemeMode } from '../../theme/index.js';

export type EgDataListPrimaryTextProps = Pick<TextProps, 'numberOfLines' | 'ellipsizeMode' | 'style' | 'testID'> & {
  children: string;
  weight?: EgDataListPrimaryWeight;
  mode?: ThemeMode;
  accessibilityLabel?: string;
};

/** Data list 主文本 · `typography-body-medium` 三档粗细。 */
export function EgDataListPrimaryText({
  children,
  weight = 'heavy',
  mode = 'light',
  style,
  ...rest
}: EgDataListPrimaryTextProps) {
  const colors = getThemeColors(mode);
  return (
    <EdsSansText
      {...rest}
      weight={egDataListPrimaryTextFontWeight(weight)}
      style={flattenEgDataListTextStyle(
        egDataListPrimaryTextLayout(),
        colors['text-base-primary'] as string,
        StyleSheet.flatten([{ flexShrink: 1 }, style]),
      )}
    >
      {children}
    </EdsSansText>
  );
}