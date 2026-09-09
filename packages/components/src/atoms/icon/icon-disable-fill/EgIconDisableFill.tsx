import { View, type ViewProps } from 'react-native';
import type { EgIconDisableFillProps } from './EgIconDisableFill.types';

/** RN implementation — eds-disable-fill (component) */
export function EgIconDisableFill(props: EgIconDisableFillProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-disable-fill' } style={style} accessibilityLabel="eds-disable-fill" />;
}
