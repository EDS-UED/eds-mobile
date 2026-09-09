import { View, type ViewProps } from 'react-native';
import type { EgIconInterfaceUnlockProps } from './EgIconInterfaceUnlock.types';

/** RN implementation — eds-interface-unlock (component) */
export function EgIconInterfaceUnlock(props: EgIconInterfaceUnlockProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-interface-unlock' } style={style} accessibilityLabel="eds-interface-unlock" />;
}
