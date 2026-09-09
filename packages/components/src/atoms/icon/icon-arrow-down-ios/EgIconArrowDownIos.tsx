import { View, type ViewProps } from 'react-native';
import type { EgIconArrowDownIosProps } from './EgIconArrowDownIos.types';

/** RN implementation — eds-arrow-down-ios (component) */
export function EgIconArrowDownIos(props: EgIconArrowDownIosProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-arrow-down-ios' } style={style} accessibilityLabel="eds-arrow-down-ios" />;
}
