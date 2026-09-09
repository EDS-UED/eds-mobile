import { View, type ViewProps } from 'react-native';
import type { EgIconWarningFillProps } from './EgIconWarningFill.types';

/** RN implementation — eds-warning-fill (component) */
export function EgIconWarningFill(props: EgIconWarningFillProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-warning-fill' } style={style} accessibilityLabel="eds-warning-fill" />;
}
