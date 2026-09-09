import { View, type ViewProps } from 'react-native';
import type { EgIconUserSearchesProps } from './EgIconUserSearches.types';

/** RN implementation — eds-user-searches (component) */
export function EgIconUserSearches(props: EgIconUserSearchesProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-user-searches' } style={style} accessibilityLabel="eds-user-searches" />;
}
