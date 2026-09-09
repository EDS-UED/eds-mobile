import { View, type ViewProps } from 'react-native';
import type { EgInputGroupProps } from './EgInputGroup.types';

/** RN implementation — Combo/Input Group (component) */
export function EgInputGroup(props: EgInputGroupProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'input-combo-input-group' } style={style} accessibilityLabel="Combo/Input Group" />;
}
