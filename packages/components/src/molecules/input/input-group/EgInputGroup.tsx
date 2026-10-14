import { StyleSheet, View, type ViewStyle } from 'react-native';
import { mobileTheme } from '../../../theme/index.js';
import type { EgCommonProps } from '../../../shared/types.js';
import type { EgFieldProps } from '../../_shared/props.js';
import { EgFieldBase } from '../_shared/EgFieldBase.js';

export type EgInputGroupProps = EgCommonProps & {
  fields?: EgFieldProps[];
  style?: ViewStyle;
};

export function EgInputGroup({
  fields = [{ placeholder: 'Input' }, { placeholder: 'Input' }],
  testID,
  style,
}: EgInputGroupProps) {
  return (
    <View testID={testID ?? 'input-combo-input-group'} style={[styles.group, style]}>
      {fields.map((field, index) => (
        <EgFieldBase
          key={index}
          {...field}
          size={field.size ?? 'md'}
          style={{ ...(index > 0 ? styles.joinedField : undefined), ...field.style }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    width: '100%',
    gap: mobileTheme.spacing['spacing-2'] as number,
  },
  joinedField: {
    marginTop: 0,
  },
});
