import { View, type ViewProps } from 'react-native';
import type { EgRadioProps } from './EgRadio.types';

/** RN implementation — Radio (set · 2 variants) */
export function EgRadio(props: EgRadioProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'toggle-radio' } style={style} accessibilityLabel="Radio" />;
}
