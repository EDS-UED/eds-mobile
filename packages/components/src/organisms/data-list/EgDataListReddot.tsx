import { StyleSheet, View, type ViewStyle } from 'react-native';

import { EgReddot } from '../../molecules/feedback/reddot/EgReddot.js';
import type { EgReddotProps } from '../../molecules/feedback/reddot/EgReddot.types.js';

export type EgDataListReddotProps = Pick<EgReddotProps, 'mode' | 'testID' | 'style' | 'accessibilityLabel'>;

/** Data list 副文本行尾未读红点 · 统一 `EgReddot`（`reddot` / `status-danger`）。 */
export function EgDataListReddot({
  mode = 'light',
  testID,
  style,
  accessibilityLabel = 'Unread',
}: EgDataListReddotProps) {
  return (
    <View style={styles.rowAlign}>
      <EgReddot
        mode={mode}
        testID={testID ?? 'data-list-reddot'}
        accessibilityLabel={accessibilityLabel}
        style={style}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  /** 与副文本行 cross-axis 居中（父级 `flexDirection: 'row'`）。 */
  rowAlign: {
    alignSelf: 'center',
    justifyContent: 'center',
  } satisfies ViewStyle,
});