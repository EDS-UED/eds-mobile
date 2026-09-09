import { View, type ViewProps } from 'react-native';
import type { EgIconDisableProps } from './EgIconDisable.types';

/** RN implementation — eds-disable (component) */
export function EgIconDisable(props: EgIconDisableProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-disable' } style={style} accessibilityLabel="eds-disable" />;
}
