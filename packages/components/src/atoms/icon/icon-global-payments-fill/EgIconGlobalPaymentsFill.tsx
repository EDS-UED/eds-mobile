import { View, type ViewProps } from 'react-native';
import type { EgIconGlobalPaymentsFillProps } from './EgIconGlobalPaymentsFill.types';

/** RN implementation — eds-global-payments -fill (component) */
export function EgIconGlobalPaymentsFill(props: EgIconGlobalPaymentsFillProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-global-payments-fill' } style={style} accessibilityLabel="eds-global-payments -fill" />;
}
