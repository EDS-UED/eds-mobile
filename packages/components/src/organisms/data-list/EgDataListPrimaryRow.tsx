import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { mobileTheme } from '../../theme/index.js';
import type { ThemeMode } from '../../theme/index.js';
import { EgDataListPrimaryText } from './EgDataListPrimaryText.js';
import type { EgDataListPrimaryTextProps } from './EgDataListPrimaryText.js';
import { EG_DATA_LIST_PRIMARY_TAG_GAP } from './egDataListMetrics.js';
import { egDataListPrimaryLineHeight } from './egDataListTypography.js';
import type { EgDataListPrimaryWeight } from './egDataListTypography.js';

export type EgDataListPrimaryRowProps = {
  children: string;
  mode?: ThemeMode;
  weight?: EgDataListPrimaryWeight;
  /** 主文本属性（`children` 除外）。 */
  primaryTextProps?: Omit<EgDataListPrimaryTextProps, 'children' | 'mode' | 'weight'>;
  /** 主文本后 · {@link EG_DATA_LIST_PRIMARY_TAG_GAP} · 挂件建议 `EgTag rowAlign`。 */
  tag?: ReactNode;
  /** 行尾挂件 / 业务插槽 · 与文本列 `spacing-2` · 挂件建议 `EgTag rowAlign`。 */
  trailing?: ReactNode;
  testID?: string;
};

/** Data list 主文本行 · 主文 + 可选 Tag（4px）+ 行尾 `trailing` 插槽。 */
export function EgDataListPrimaryRow({
  children,
  mode = 'light',
  weight = 'heavy',
  primaryTextProps,
  tag,
  trailing,
  testID,
}: EgDataListPrimaryRowProps) {
  const rowGap = mobileTheme.spacing['spacing-2'] as number;
  const lineHeight = egDataListPrimaryLineHeight();

  return (
    <View
      testID={testID}
      style={[styles.row, { gap: rowGap, minHeight: lineHeight, height: lineHeight }]}
      accessibilityRole="none"
    >
      <View style={[styles.primaryCluster, { minHeight: lineHeight }]}>
        <EgDataListPrimaryText
          mode={mode}
          weight={weight}
          numberOfLines={1}
          {...primaryTextProps}
          style={StyleSheet.flatten([styles.primaryText, primaryTextProps?.style])}
        >
          {children}
        </EgDataListPrimaryText>
        {tag ? <View style={[styles.tagSlot, { minHeight: lineHeight }]}>{tag}</View> : null}
      </View>
      {trailing != null ? (
        <View style={[styles.trailingSlot, { height: lineHeight }]}>{trailing}</View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  primaryCluster: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryText: {
    flexShrink: 1,
    minWidth: 0,
  },
  tagSlot: {
    flexShrink: 0,
    marginLeft: EG_DATA_LIST_PRIMARY_TAG_GAP,
    justifyContent: 'center',
  },
  trailingSlot: {
    flexShrink: 0,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
});