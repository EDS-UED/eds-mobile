import { View, type ViewProps } from 'react-native';
import type { EgIconArrowIntegratedSortMiniProps } from './EgIconArrowIntegratedSortMini.types';

/** RN implementation — eds-arrow-integrated-sort-mini (component) */
export function EgIconArrowIntegratedSortMini(props: EgIconArrowIntegratedSortMiniProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-arrow-integrated-sort-mini' } style={style} accessibilityLabel="eds-arrow-integrated-sort-mini" />;
}
