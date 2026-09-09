import { View, type ViewProps } from 'react-native';
import type { EgIconMerchantProps } from './EgIconMerchant.types';

/** RN implementation — eds-merchant (component) */
export function EgIconMerchant(props: EgIconMerchantProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-merchant' } style={style} accessibilityLabel="eds-merchant" />;
}
