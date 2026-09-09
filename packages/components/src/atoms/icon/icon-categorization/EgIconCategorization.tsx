import { View, type ViewProps } from 'react-native';
import type { EgIconCategorizationProps } from './EgIconCategorization.types';

/** RN implementation — eds-categorization (component) */
export function EgIconCategorization(props: EgIconCategorizationProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-categorization' } style={style} accessibilityLabel="eds-categorization" />;
}
