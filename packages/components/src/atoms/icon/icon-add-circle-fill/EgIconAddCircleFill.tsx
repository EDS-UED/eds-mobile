import { View, type ViewProps } from 'react-native';
import type { EgIconAddCircleFillProps } from './EgIconAddCircleFill.types';

/** RN implementation — eds-add-circle-fill (component) */
export function EgIconAddCircleFill(props: EgIconAddCircleFillProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-add-circle-fill' } style={style} accessibilityLabel="eds-add-circle-fill" />;
}
