import { View, type ViewProps } from 'react-native';
import type { EgIconFloderFavoriteFillProps } from './EgIconFloderFavoriteFill.types';

/** RN implementation — eds-floder-favorite-fill (component) */
export function EgIconFloderFavoriteFill(props: EgIconFloderFavoriteFillProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-floder-favorite-fill' } style={style} accessibilityLabel="eds-floder-favorite-fill" />;
}
