import { View, type ViewProps } from 'react-native';
import type { EgIconMerchantFillProps } from './EgIconMerchantFill.types';

/** RN implementation — eds-merchant-fill (component) */
export function EgIconMerchantFill(props: EgIconMerchantFillProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-merchant-fill' } style={style} accessibilityLabel="eds-merchant-fill" />;
}
