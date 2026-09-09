import { View, type ViewProps } from 'react-native';
import type { EgIconAppEcologyProps } from './EgIconAppEcology.types';

/** RN implementation — eds-app-ecology (component) */
export function EgIconAppEcology(props: EgIconAppEcologyProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-app-ecology' } style={style} accessibilityLabel="eds-app-ecology" />;
}
