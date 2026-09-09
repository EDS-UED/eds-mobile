import { View, type ViewProps } from 'react-native';
import type { EgIconArrowUpdateProps } from './EgIconArrowUpdate.types';

/** RN implementation — eds-arrow-update (component) */
export function EgIconArrowUpdate(props: EgIconArrowUpdateProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-arrow-update' } style={style} accessibilityLabel="eds-arrow-update" />;
}
