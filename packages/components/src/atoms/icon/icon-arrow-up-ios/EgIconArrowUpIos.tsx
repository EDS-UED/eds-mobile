import { View, type ViewProps } from 'react-native';
import type { EgIconArrowUpIosProps } from './EgIconArrowUpIos.types';

/** RN implementation — eds-arrow-up-ios (component) */
export function EgIconArrowUpIos(props: EgIconArrowUpIosProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-arrow-up-ios' } style={style} accessibilityLabel="eds-arrow-up-ios" />;
}
