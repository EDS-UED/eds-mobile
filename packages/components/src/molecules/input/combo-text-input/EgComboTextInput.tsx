import { StyleSheet, View, type ViewStyle } from 'react-native';
import { mobileTheme } from '../../../theme/index.js';
import type { EgFieldProps } from '../../_shared/props.js';
import type { EgCommonProps } from '../../../shared/types.js';
import { EgFieldBase } from '../_shared/EgFieldBase.js';

export type EgComboTextInputProps = EgCommonProps & {
  leading?: EgFieldProps;
  main?: EgFieldProps;
  style?: ViewStyle;
};

export function EgComboTextInput({ leading, main, testID, style }: EgComboTextInputProps) {
  return (
    <View testID={testID ?? 'input-combo-text-input'} style={[styles.row, style]}>
      {leading ? (
        <EgFieldBase
          {...leading}
          size={leading.size ?? 'sm'}
          style={{ ...styles.leading, ...leading.style }}
        />
      ) : null}
      <EgFieldBase
        {...main}
        size={main?.size ?? 'md'}
        placeholder={main?.placeholder ?? 'Input'}
        style={{ ...styles.main, ...main?.style }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: mobileTheme.spacing['spacing-2'] as number,
    width: '100%',
  },
  leading: {
    flexShrink: 0,
    width: 88,
  },
  main: {
    flex: 1,
  },
});
