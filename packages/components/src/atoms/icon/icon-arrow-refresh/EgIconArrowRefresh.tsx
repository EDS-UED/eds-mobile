import { View, type ViewProps } from 'react-native';
import type { EgIconArrowRefreshProps } from './EgIconArrowRefresh.types';

/** RN implementation — eds-arrow-refresh (component) */
export function EgIconArrowRefresh(props: EgIconArrowRefreshProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-arrow-refresh' } style={style} accessibilityLabel="eds-arrow-refresh" />;
}
