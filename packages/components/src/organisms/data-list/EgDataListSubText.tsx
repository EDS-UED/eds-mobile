import { StyleSheet, type TextProps, type TextStyle } from 'react-native';

import { EdsSansText } from '../../shared/EdsSansText.js';
import { getThemeColors } from '../../theme/index.js';
import { EG_DATA_LIST_SUB_TEXT_MAX_LINES } from './egDataListMetrics.js';
import {
  egDataListSubTextFontWeight,
  egDataListSubTextLayout,
  egDataListSubTextSegmentAFontWeight,
  flattenEgDataListTextStyle,
} from './egDataListTypography.js';
import type { ThemeMode } from '../../theme/index.js';

export type EgDataListSubTextProps = Pick<TextProps, 'style' | 'testID' | 'numberOfLines' | 'ellipsizeMode'> & {
  /** 片段 A（可与 `segmentB` 拼接；`boldSegmentA` 时 A 走 body-small-strong）。 */
  segmentA: string;
  segmentB?: string;
  boldSegmentA?: boolean;
  mode?: ThemeMode;
  accessibilityLabel?: string;
};

/** Data list 副文本 · 最多 {@link EG_DATA_LIST_SUB_TEXT_MAX_LINES} 行；可选片段 A 加粗。 */
export function EgDataListSubText({
  segmentA,
  segmentB = '',
  boldSegmentA = false,
  mode = 'light',
  style,
  numberOfLines = EG_DATA_LIST_SUB_TEXT_MAX_LINES,
  ellipsizeMode = 'tail',
  ...rest
}: EgDataListSubTextProps) {
  const colors = getThemeColors(mode);
  const secondary = colors['text-base-secondary'] as string;
  const layout = egDataListSubTextLayout();
  const bodyStyle = flattenEgDataListTextStyle(
    layout,
    secondary,
    style != null ? (StyleSheet.flatten(style) as TextStyle) : undefined,
  );
  const strongStyle = flattenEgDataListTextStyle(layout, secondary);

  return (
    <EdsSansText
      {...rest}
      weight={egDataListSubTextFontWeight()}
      style={bodyStyle}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
    >
      {boldSegmentA ? (
        <>
          <EdsSansText weight={egDataListSubTextSegmentAFontWeight()} style={strongStyle}>
            {segmentA}
          </EdsSansText>
          <EdsSansText weight={egDataListSubTextFontWeight()} style={bodyStyle}>
            {segmentB}
          </EdsSansText>
        </>
      ) : (
        `${segmentA}${segmentB}`
      )}
    </EdsSansText>
  );
}