import { View, type ViewProps } from 'react-native';
import type { EgIconArrowLeftProps } from './EgIconArrowLeft.types';

/** RN implementation — eds-arrow-left (component) */
export function EgIconArrowLeft(props: EgIconArrowLeftProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-arrow-left' } style={style} accessibilityLabel="eds-arrow-left" />;
}
