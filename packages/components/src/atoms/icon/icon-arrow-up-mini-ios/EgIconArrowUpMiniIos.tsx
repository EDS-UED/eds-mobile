import { View, type ViewProps } from 'react-native';
import type { EgIconArrowUpMiniIosProps } from './EgIconArrowUpMiniIos.types';

/** RN implementation — eds-arrow-up-mini-ios (component) */
export function EgIconArrowUpMiniIos(props: EgIconArrowUpMiniIosProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-arrow-up-mini-ios' } style={style} accessibilityLabel="eds-arrow-up-mini-ios" />;
}
