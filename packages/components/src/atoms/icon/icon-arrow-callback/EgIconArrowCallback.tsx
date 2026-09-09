import { View, type ViewProps } from 'react-native';
import type { EgIconArrowCallbackProps } from './EgIconArrowCallback.types';

/** RN implementation — eds-arrow-callback (component) */
export function EgIconArrowCallback(props: EgIconArrowCallbackProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-arrow-callback' } style={style} accessibilityLabel="eds-arrow-callback" />;
}
