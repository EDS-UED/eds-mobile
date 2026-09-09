import { View, type ViewProps } from 'react-native';
import type { EgIconTickStrongFillProps } from './EgIconTickStrongFill.types';

/** RN implementation — eds-tick-strong-fill (component) */
export function EgIconTickStrongFill(props: EgIconTickStrongFillProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-tick-strong-fill' } style={style} accessibilityLabel="eds-tick-strong-fill" />;
}
