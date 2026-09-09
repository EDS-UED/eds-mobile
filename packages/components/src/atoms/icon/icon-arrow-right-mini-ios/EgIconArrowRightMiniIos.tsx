import { View, type ViewProps } from 'react-native';
import type { EgIconArrowRightMiniIosProps } from './EgIconArrowRightMiniIos.types';

/** RN implementation — eds-arrow-right-mini-ios (component) */
export function EgIconArrowRightMiniIos(props: EgIconArrowRightMiniIosProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-arrow-right-mini-ios' } style={style} accessibilityLabel="eds-arrow-right-mini-ios" />;
}
