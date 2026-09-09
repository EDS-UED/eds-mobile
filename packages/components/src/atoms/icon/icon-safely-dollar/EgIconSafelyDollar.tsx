import { View, type ViewProps } from 'react-native';
import type { EgIconSafelyDollarProps } from './EgIconSafelyDollar.types';

/** RN implementation — eds-safely-dollar (component) */
export function EgIconSafelyDollar(props: EgIconSafelyDollarProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-safely-dollar' } style={style} accessibilityLabel="eds-safely-dollar" />;
}
