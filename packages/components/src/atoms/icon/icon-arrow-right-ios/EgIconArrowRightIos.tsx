import { View, type ViewProps } from 'react-native';
import type { EgIconArrowRightIosProps } from './EgIconArrowRightIos.types';

/** RN implementation — eds-arrow-right-ios (component) */
export function EgIconArrowRightIos(props: EgIconArrowRightIosProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-arrow-right-ios' } style={style} accessibilityLabel="eds-arrow-right-ios" />;
}
