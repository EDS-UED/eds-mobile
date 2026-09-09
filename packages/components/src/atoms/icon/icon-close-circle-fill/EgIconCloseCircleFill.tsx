import { View, type ViewProps } from 'react-native';
import type { EgIconCloseCircleFillProps } from './EgIconCloseCircleFill.types';

/** RN implementation — eds-close-circle-fill (component) */
export function EgIconCloseCircleFill(props: EgIconCloseCircleFillProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-close-circle-fill' } style={style} accessibilityLabel="eds-close-circle-fill" />;
}
