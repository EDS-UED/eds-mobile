import { View, type ViewProps } from 'react-native';
import type { EgIconArrowMarketDownProps } from './EgIconArrowMarketDown.types';

/** RN implementation — eds-arrow-market-down (component) */
export function EgIconArrowMarketDown(props: EgIconArrowMarketDownProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-arrow-market-down' } style={style} accessibilityLabel="eds-arrow-market-down" />;
}
