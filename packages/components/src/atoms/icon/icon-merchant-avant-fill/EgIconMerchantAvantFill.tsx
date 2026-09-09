import { View, type ViewProps } from 'react-native';
import type { EgIconMerchantAvantFillProps } from './EgIconMerchantAvantFill.types';

/** RN implementation — eds-merchant-avant-fill (component) */
export function EgIconMerchantAvantFill(props: EgIconMerchantAvantFillProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-merchant-avant-fill' } style={style} accessibilityLabel="eds-merchant-avant-fill" />;
}
