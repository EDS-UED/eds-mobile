import { View, type ViewProps } from 'react-native';
import type { EgIconUserSecurityProps } from './EgIconUserSecurity.types';

/** RN implementation — eds-user-security (component) */
export function EgIconUserSecurity(props: EgIconUserSecurityProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-user-security' } style={style} accessibilityLabel="eds-user-security" />;
}
