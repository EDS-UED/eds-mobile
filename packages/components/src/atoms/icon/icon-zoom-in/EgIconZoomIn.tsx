import { View, type ViewProps } from 'react-native';
import type { EgIconZoomInProps } from './EgIconZoomIn.types';

/** RN implementation — eds-zoom-in (component) */
export function EgIconZoomIn(props: EgIconZoomInProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-zoom-in' } style={style} accessibilityLabel="eds-zoom-in" />;
}
