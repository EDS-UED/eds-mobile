import { View, type ViewProps } from 'react-native';
import type { EgIconArrowLeftMiniIosProps } from './EgIconArrowLeftMiniIos.types';

/** RN implementation — eds-arrow-left-mini-ios (component) */
export function EgIconArrowLeftMiniIos(props: EgIconArrowLeftMiniIosProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-arrow-left-mini-ios' } style={style} accessibilityLabel="eds-arrow-left-mini-ios" />;
}
