import { View, type ViewProps } from 'react-native';
import type { EgIconSearchProps } from './EgIconSearch.types';

/** RN implementation — eds-search (component) */
export function EgIconSearch(props: EgIconSearchProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-search' } style={style} accessibilityLabel="eds-search" />;
}
