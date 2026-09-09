import { View, type ViewProps } from 'react-native';
import type { EgIconTickProps } from './EgIconTick.types';

/** RN implementation — eds-tick (component) */
export function EgIconTick(props: EgIconTickProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-tick' } style={style} accessibilityLabel="eds-tick" />;
}
