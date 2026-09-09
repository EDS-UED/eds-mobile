import { View, type ViewProps } from 'react-native';
import type { EgIconArrowIntegratedSortProps } from './EgIconArrowIntegratedSort.types';

/** RN implementation — eds-arrow-integrated-sort (component) */
export function EgIconArrowIntegratedSort(props: EgIconArrowIntegratedSortProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-arrow-integrated-sort' } style={style} accessibilityLabel="eds-arrow-integrated-sort" />;
}
