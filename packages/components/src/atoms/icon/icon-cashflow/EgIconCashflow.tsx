import { View, type ViewProps } from 'react-native';
import type { EgIconCashflowProps } from './EgIconCashflow.types';

/** RN implementation — eds-cashflow (component) */
export function EgIconCashflow(props: EgIconCashflowProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-cashflow' } style={style} accessibilityLabel="eds-cashflow" />;
}
