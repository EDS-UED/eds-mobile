import { View, type ViewProps } from 'react-native';
import type { EgIconPayorProps } from './EgIconPayor.types';

/** RN implementation — eds-payor (component) */
export function EgIconPayor(props: EgIconPayorProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-payor' } style={style} accessibilityLabel="eds-payor" />;
}
