import { View, type ViewProps } from 'react-native';
import type { EgIconInterfaceLockProps } from './EgIconInterfaceLock.types';

/** RN implementation — eds-interface-lock (component) */
export function EgIconInterfaceLock(props: EgIconInterfaceLockProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-interface-lock' } style={style} accessibilityLabel="eds-interface-lock" />;
}
