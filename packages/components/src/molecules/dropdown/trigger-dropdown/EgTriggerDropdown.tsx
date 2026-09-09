import { View, type ViewProps } from 'react-native';
import type { EgTriggerDropdownProps } from './EgTriggerDropdown.types';

/** RN implementation — Trigger (set · 15 variants) */
export function EgTriggerDropdown(props: EgTriggerDropdownProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'dropdown-trigger' } style={style} accessibilityLabel="Trigger" />;
}
