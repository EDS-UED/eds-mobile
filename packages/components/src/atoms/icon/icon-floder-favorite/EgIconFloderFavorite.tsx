import { View, type ViewProps } from 'react-native';
import type { EgIconFloderFavoriteProps } from './EgIconFloderFavorite.types';

/** RN implementation — eds-floder-favorite (component) */
export function EgIconFloderFavorite(props: EgIconFloderFavoriteProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-floder-favorite' } style={style} accessibilityLabel="eds-floder-favorite" />;
}
