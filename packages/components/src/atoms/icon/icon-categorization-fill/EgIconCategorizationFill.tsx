import { View, type ViewProps } from 'react-native';
import type { EgIconCategorizationFillProps } from './EgIconCategorizationFill.types';

/** RN implementation — eds-categorization-fill (component) */
export function EgIconCategorizationFill(props: EgIconCategorizationFillProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-categorization-fill' } style={style} accessibilityLabel="eds-categorization-fill" />;
}
