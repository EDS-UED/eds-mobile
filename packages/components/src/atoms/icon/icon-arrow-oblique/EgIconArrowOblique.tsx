import { View, type ViewProps } from 'react-native';
import type { EgIconArrowObliqueProps } from './EgIconArrowOblique.types';

/** RN implementation — eds-arrow-oblique (component) */
export function EgIconArrowOblique(props: EgIconArrowObliqueProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-arrow-oblique' } style={style} accessibilityLabel="eds-arrow-oblique" />;
}
