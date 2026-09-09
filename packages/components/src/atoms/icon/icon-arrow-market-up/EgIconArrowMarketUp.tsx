import { View, type ViewProps } from 'react-native';
import type { EgIconArrowMarketUpProps } from './EgIconArrowMarketUp.types';

/** RN implementation — eds-arrow-market-up (component) */
export function EgIconArrowMarketUp(props: EgIconArrowMarketUpProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-arrow-market-up' } style={style} accessibilityLabel="eds-arrow-market-up" />;
}
