import { View, type ViewProps } from 'react-native';
import type { EgIconAddProps } from './EgIconAdd.types';

/** RN implementation — eds-add (component) */
export function EgIconAdd(props: EgIconAddProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-add' } style={style} accessibilityLabel="eds-add" />;
}
