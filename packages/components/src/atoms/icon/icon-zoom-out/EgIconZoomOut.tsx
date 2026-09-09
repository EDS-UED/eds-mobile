import { View, type ViewProps } from 'react-native';
import type { EgIconZoomOutProps } from './EgIconZoomOut.types';

/** RN implementation — eds-zoom-out (component) */
export function EgIconZoomOut(props: EgIconZoomOutProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-zoom-out' } style={style} accessibilityLabel="eds-zoom-out" />;
}
