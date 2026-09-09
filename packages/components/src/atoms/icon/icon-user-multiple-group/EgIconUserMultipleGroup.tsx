import { View, type ViewProps } from 'react-native';
import type { EgIconUserMultipleGroupProps } from './EgIconUserMultipleGroup.types';

/** RN implementation — eds-user-multiple-group (component) */
export function EgIconUserMultipleGroup(props: EgIconUserMultipleGroupProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-user-multiple-group' } style={style} accessibilityLabel="eds-user-multiple-group" />;
}
