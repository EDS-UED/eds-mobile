import { View, type ViewProps } from 'react-native';
import type { EgIconInterfaceLockFillProps } from './EgIconInterfaceLockFill.types';

/** RN implementation — eds-interface-lock-fill (component) */
export function EgIconInterfaceLockFill(props: EgIconInterfaceLockFillProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-interface-lock-fill' } style={style} accessibilityLabel="eds-interface-lock-fill" />;
}
