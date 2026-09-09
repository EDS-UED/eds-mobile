import { View, type ViewProps } from 'react-native';
import type { EgIconUsdReceiptProps } from './EgIconUsdReceipt.types';

/** RN implementation — eds-usd-receipt (component) */
export function EgIconUsdReceipt(props: EgIconUsdReceiptProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-usd-receipt' } style={style} accessibilityLabel="eds-usd-receipt" />;
}
