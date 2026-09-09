import { View, type ViewProps } from 'react-native';
import type { EgIconArrowLeftIosProps } from './EgIconArrowLeftIos.types';

/** RN implementation — eds-arrow-left-ios (component) */
export function EgIconArrowLeftIos(props: EgIconArrowLeftIosProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-arrow-left-ios' } style={style} accessibilityLabel="eds-arrow-left-ios" />;
}
