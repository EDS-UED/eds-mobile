import { View, type ViewProps } from 'react-native';
import type { EgIconArrowDownMiniIosProps } from './EgIconArrowDownMiniIos.types';

/** RN implementation — eds-arrow-down-mini-ios (component) */
export function EgIconArrowDownMiniIos(props: EgIconArrowDownMiniIosProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-arrow-down-mini-ios' } style={style} accessibilityLabel="eds-arrow-down-mini-ios" />;
}
