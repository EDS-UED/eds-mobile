import { View, type ViewProps } from 'react-native';
import type { EgSegmentedControlProps } from './EgSegmentedControl.types';

/** RN implementation — Segmented Control (set · 6 variants) */
export function EgSegmentedControl(props: EgSegmentedControlProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'tab-segmented-control' } style={style} accessibilityLabel="Segmented Control" />;
}
