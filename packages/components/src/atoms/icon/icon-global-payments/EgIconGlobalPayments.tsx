import { View, type ViewProps } from 'react-native';
import type { EgIconGlobalPaymentsProps } from './EgIconGlobalPayments.types';

/** RN implementation — eds-global-payments (component) */
export function EgIconGlobalPayments(props: EgIconGlobalPaymentsProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-global-payments' } style={style} accessibilityLabel="eds-global-payments" />;
}
