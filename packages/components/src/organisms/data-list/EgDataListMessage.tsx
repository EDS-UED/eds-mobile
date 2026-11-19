import { StyleSheet, View, type ViewStyle } from 'react-native';

import { EgMessage } from '../../molecules/feedback/message/EgMessage.js';
import type { EgMessageProps } from '../../molecules/feedback/message/EgMessage.types.js';

export type EgDataListMessageProps = Pick<
  EgMessageProps,
  'mode' | 'testID' | 'style' | 'accessibilityLabel' | 'label' | 'children'
>;

/** Data list 副文本行尾 Message 胶囊 · 默认危险色调 · 与 {@link EgDataListSubText} 同行。 */
export function EgDataListMessage({
  mode = 'light',
  testID,
  style,
  accessibilityLabel,
  label,
  children,
}: EgDataListMessageProps) {
  return (
    <View style={styles.rowAlign}>
      <EgMessage
        mode={mode}
        tone="danger"
        testID={testID ?? 'data-list-message'}
        accessibilityLabel={accessibilityLabel}
        label={label}
        style={style}
      >
        {children}
      </EgMessage>
    </View>
  );
}

const styles = StyleSheet.create({
  /** 与副文本行 cross-axis 居中（父级 `flexDirection: 'row'`）。 */
  rowAlign: {
    alignSelf: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  } satisfies ViewStyle,
});