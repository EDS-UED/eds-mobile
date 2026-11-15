import {
  Platform,
  StyleSheet,
  Text,
  type TextProps,
  type TextStyle,
} from 'react-native';

import { edsFontStyle } from './fontFamily.js';
import { splitEdsSansTextRuns } from './splitEdsSansTextRuns.js';

export type EdsSansTextProps = TextProps & {
  /** Token 字重；未传时从 `style.fontWeight` 读取，默认 400。 */
  weight?: TextStyle['fontWeight'];
};

function resolveWeight(style: TextStyle | undefined, weight?: TextStyle['fontWeight']): TextStyle['fontWeight'] {
  return weight ?? (style?.fontWeight as TextStyle['fontWeight'] | undefined) ?? '400';
}

function containerStyleFrom(style: TextStyle | undefined): TextStyle {
  if (!style) {
    return {};
  }
  const { fontFamily: _f, fontWeight: _w, ...rest } = style;
  return rest;
}

/**
 * Sans 文案真源：Android / Web 走 bundled `EDSText-*`；
 * iOS 混排 Latin → `EDSText-*`，CJK → 系统字（同一 `fontWeight`），避免真机 □ 且保留品牌拉丁字形。
 */
export function EdsSansText({ style, weight, children, ...rest }: EdsSansTextProps) {
  const flat = StyleSheet.flatten(style) as TextStyle | undefined;
  const resolvedWeight = resolveWeight(flat, weight);
  const containerStyle = containerStyleFrom(flat);

  if (Platform.OS !== 'ios' || children == null || typeof children !== 'string') {
    return (
      <Text style={[containerStyle, edsFontStyle(resolvedWeight)]} {...rest}>
        {children}
      </Text>
    );
  }

  const runs = splitEdsSansTextRuns(children);
  const latinStyle = edsFontStyle(resolvedWeight);
  const cjkStyle: TextStyle = { fontWeight: resolvedWeight };

  if (runs.length <= 1) {
    const script = runs[0]?.script ?? 'latin';
    return (
      <Text
        style={[containerStyle, script === 'latin' ? latinStyle : cjkStyle]}
        {...rest}
      >
        {children}
      </Text>
    );
  }

  return (
    <Text style={containerStyle} {...rest}>
      {runs.map((run, index) => (
        <Text
          key={`${index}-${run.script}`}
          style={run.script === 'latin' ? latinStyle : cjkStyle}
        >
          {run.text}
        </Text>
      ))}
    </Text>
  );
}