import { View, type ViewProps } from 'react-native';
import type { EgIconWarningProps } from './EgIconWarning.types';

/** RN implementation — eds-warning (component) */
export function EgIconWarning(props: EgIconWarningProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-warning' } style={style} accessibilityLabel="eds-warning" />;
}
