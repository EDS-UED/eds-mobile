import { View, type ViewProps } from 'react-native';
import type { EgIconArrowRefusesProps } from './EgIconArrowRefuses.types';

/** RN implementation — eds-arrow-refuses (component) */
export function EgIconArrowRefuses(props: EgIconArrowRefusesProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-arrow-refuses' } style={style} accessibilityLabel="eds-arrow-refuses" />;
}
