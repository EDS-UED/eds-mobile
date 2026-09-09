import { View, type ViewProps } from 'react-native';
import type { EgIconEnableFillProps } from './EgIconEnableFill.types';

/** RN implementation — eds-enable-fill (component) */
export function EgIconEnableFill(props: EgIconEnableFillProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-enable-fill' } style={style} accessibilityLabel="eds-enable-fill" />;
}
