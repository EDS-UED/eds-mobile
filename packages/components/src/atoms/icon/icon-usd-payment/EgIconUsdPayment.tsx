import { View, type ViewProps } from 'react-native';
import type { EgIconUsdPaymentProps } from './EgIconUsdPayment.types';

/** RN implementation — eds-usd-payment (component) */
export function EgIconUsdPayment(props: EgIconUsdPaymentProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-usd-payment' } style={style} accessibilityLabel="eds-usd-payment" />;
}
