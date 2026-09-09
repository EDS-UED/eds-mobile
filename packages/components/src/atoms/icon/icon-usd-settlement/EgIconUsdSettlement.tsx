import { View, type ViewProps } from 'react-native';
import type { EgIconUsdSettlementProps } from './EgIconUsdSettlement.types';

/** RN implementation — eds-usd-settlement (component) */
export function EgIconUsdSettlement(props: EgIconUsdSettlementProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-usd-settlement' } style={style} accessibilityLabel="eds-usd-settlement" />;
}
