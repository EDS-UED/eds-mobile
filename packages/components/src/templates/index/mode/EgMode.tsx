import { View, type ViewProps } from 'react-native';
import type { EgModeProps } from './EgMode.types.js';

/** RN implementation — Mode (component) */
export function EgMode(props: EgModeProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'mode' } style={style} accessibilityLabel="Mode" />;
}
