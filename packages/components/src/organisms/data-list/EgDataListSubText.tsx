import { StyleSheet, View, type TextProps, type TextStyle } from 'react-native';

import { EgAvatar } from '../../atoms/avatar/avatar/index.js';
import { EdsSansText } from '../../shared/EdsSansText.js';
import { getThemeColors, mobileTheme, type ThemeMode } from '../../theme/index.js';
import { EG_DATA_LIST_SUB_TEXT_MAX_LINES } from './egDataListMetrics.js';
import {
  egDataListSubTextFontWeight,
  egDataListSubTextLayout,
  egDataListSubTextSegmentAFontWeight,
  flattenEgDataListTextStyle,
} from './egDataListTypography.js';

/** 副文本 · 片段 A 前符号 · 默认关（不传 `segmentSymbol`）。 */
export type EgDataListSubTextSegmentSymbol = {
  /** `EgAvatar` 展示名 / seed。 */
  name: string;
  colorIndex?: number;
};

export type EgDataListSubTextProps = Pick<TextProps, 'style' | 'testID' | 'numberOfLines' | 'ellipsizeMode'> & {
  /** 片段 A（可与 `segmentB` 拼接；`boldSegmentA` 时 A 走 body-small-strong）。 */
  segmentA: string;
  segmentB?: string;
  boldSegmentA?: boolean;
  /** 符号 · 片段 A 前 `EgAvatar` · 尺寸 `xs` · 默认关。 */
  segmentSymbol?: EgDataListSubTextSegmentSymbol;
  mode?: ThemeMode;
  accessibilityLabel?: string;
};

function EgDataListSubTextBody({
  segmentA,
  segmentB,
  boldSegmentA,
  mode = 'light',
  style,
  numberOfLines,
  ellipsizeMode,
  ...rest
}: Omit<EgDataListSubTextProps, 'segmentSymbol'>) {
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

/** Data list 副文本 · 最多 {@link EG_DATA_LIST_SUB_TEXT_MAX_LINES} 行；可选片段 A 加粗 · 可选符号。 */
export function EgDataListSubText({
  segmentSymbol,
  mode = 'light',
  ...rest
}: EgDataListSubTextProps) {
  if (segmentSymbol == null) {
    return <EgDataListSubTextBody mode={mode} {...rest} />;
  }

  const symbolGap = mobileTheme.spacing['spacing-1'] as number;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
        gap: symbolGap,
        minWidth: 0,
      }}
    >
      <EgAvatar
        size="xs"
        name={segmentSymbol.name}
        colorIndex={segmentSymbol.colorIndex}
        accessibilityLabel={segmentSymbol.name}
      />
      <View style={{ flex: 1, minWidth: 0 }}>
        <EgDataListSubTextBody mode={mode} {...rest} />
      </View>
    </View>
  );
}