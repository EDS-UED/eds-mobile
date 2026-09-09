import { View, type ViewProps } from 'react-native';
import type { EgIconReductionProps } from './EgIconReduction.types';

/** RN implementation — eds-reduction (component) */
export function EgIconReduction(props: EgIconReductionProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-reduction' } style={style} accessibilityLabel="eds-reduction" />;
}
