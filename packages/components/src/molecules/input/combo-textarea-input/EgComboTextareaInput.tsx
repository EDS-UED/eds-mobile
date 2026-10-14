import { StyleSheet, View, type ViewStyle } from 'react-native';
import { mobileTheme } from '../../../theme/index.js';
import type { EgFieldProps } from '../../_shared/props.js';
import type { EgCommonProps } from '../../../shared/types.js';
import { EgFieldBase } from '../_shared/EgFieldBase.js';

export type EgComboTextareaInputProps = EgCommonProps & {
  header?: EgFieldProps;
  body?: EgFieldProps;
  style?: ViewStyle;
};

export function EgComboTextareaInput({ header, body, testID, style }: EgComboTextareaInputProps) {
  return (
    <View testID={testID ?? 'input-combo-textarea-input'} style={[styles.column, style]}>
      {header ? (
        <EgFieldBase {...header} size={header.size ?? 'sm'} placeholder={header.placeholder ?? 'Header'} />
      ) : null}
      <EgFieldBase
        {...body}
        kind="textarea"
        size={body?.size ?? 'md'}
        placeholder={body?.placeholder ?? 'Textarea'}
        style={styles.body}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    width: '100%',
    gap: mobileTheme.spacing['spacing-2'] as number,
  },
  body: {
    minHeight: (mobileTheme.spacing['spacing-12'] as number) * 2,
  },
});
