import { View, type ViewProps } from 'react-native';
import type { EgSegmentedControlBaseProps } from './EgSegmentedControlBase.types';

/** RN implementation — Base_Segmented Control (set · 12 variants) */
export function EgSegmentedControlBase(props: EgSegmentedControlBaseProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'tab-base-segmented-control' } style={style} accessibilityLabel="Base_Segmented Control" />;
}
