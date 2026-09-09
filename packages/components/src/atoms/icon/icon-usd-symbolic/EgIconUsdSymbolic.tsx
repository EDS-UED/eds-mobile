import { View, type ViewProps } from 'react-native';
import type { EgIconUsdSymbolicProps } from './EgIconUsdSymbolic.types';

/** RN implementation — eds-usd-symbolic (component) */
export function EgIconUsdSymbolic(props: EgIconUsdSymbolicProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-usd-symbolic' } style={style} accessibilityLabel="eds-usd-symbolic" />;
}
