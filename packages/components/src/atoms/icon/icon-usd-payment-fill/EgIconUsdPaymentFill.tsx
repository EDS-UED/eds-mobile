import { View, type ViewProps } from 'react-native';
import type { EgIconUsdPaymentFillProps } from './EgIconUsdPaymentFill.types';

/** RN implementation — eds-usd-payment-fill (component) */
export function EgIconUsdPaymentFill(props: EgIconUsdPaymentFillProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-usd-payment-fill' } style={style} accessibilityLabel="eds-usd-payment-fill" />;
}
