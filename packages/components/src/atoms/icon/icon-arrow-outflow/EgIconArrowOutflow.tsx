import { View, type ViewProps } from 'react-native';
import type { EgIconArrowOutflowProps } from './EgIconArrowOutflow.types';

/** RN implementation — eds-arrow-outflow (component) */
export function EgIconArrowOutflow(props: EgIconArrowOutflowProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-arrow-outflow' } style={style} accessibilityLabel="eds-arrow-outflow" />;
}
