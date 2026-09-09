import { View, type ViewProps } from 'react-native';
import type { EgIconAddRoleProps } from './EgIconAddRole.types';

/** RN implementation — eds-add-role (component) */
export function EgIconAddRole(props: EgIconAddRoleProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-add-role' } style={style} accessibilityLabel="eds-add-role" />;
}
