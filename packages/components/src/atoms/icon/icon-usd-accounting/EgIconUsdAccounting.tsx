import { View, type ViewProps } from 'react-native';
import type { EgIconUsdAccountingProps } from './EgIconUsdAccounting.types';

/** RN implementation — eds-usd-accounting (component) */
export function EgIconUsdAccounting(props: EgIconUsdAccountingProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-usd-accounting' } style={style} accessibilityLabel="eds-usd-accounting" />;
}
