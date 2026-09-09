import { View, type ViewProps } from 'react-native';
import type { EgIconTickFillProps } from './EgIconTickFill.types';

/** RN implementation — eds-tick-fill (component) */
export function EgIconTickFill(props: EgIconTickFillProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-tick-fill' } style={style} accessibilityLabel="eds-tick-fill" />;
}
