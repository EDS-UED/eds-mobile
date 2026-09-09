import { View, type ViewProps } from 'react-native';
import type { EgIconUsdAccountingFillProps } from './EgIconUsdAccountingFill.types';

/** RN implementation — eds-usd-accounting-fill (component) */
export function EgIconUsdAccountingFill(props: EgIconUsdAccountingFillProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-usd-accounting-fill' } style={style} accessibilityLabel="eds-usd-accounting-fill" />;
}
