import { View, type ViewProps } from 'react-native';
import type { EgIconRecycleProps } from './EgIconRecycle.types';

/** RN implementation — eds-recycle (component) */
export function EgIconRecycle(props: EgIconRecycleProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-recycle' } style={style} accessibilityLabel="eds-recycle" />;
}
