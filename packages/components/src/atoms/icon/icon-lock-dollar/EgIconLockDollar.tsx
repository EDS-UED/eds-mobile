import { View, type ViewProps } from 'react-native';
import type { EgIconLockDollarProps } from './EgIconLockDollar.types';

/** RN implementation — eds-lock-dollar (component) */
export function EgIconLockDollar(props: EgIconLockDollarProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-lock-dollar' } style={style} accessibilityLabel="eds-lock-dollar" />;
}
