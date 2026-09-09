import { View, type ViewProps } from 'react-native';
import type { EgIconUserMobiletabbarProps } from './EgIconUserMobiletabbar.types';

/** RN implementation — eds-user-mobiletabbar (component) */
export function EgIconUserMobiletabbar(props: EgIconUserMobiletabbarProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-user-mobiletabbar' } style={style} accessibilityLabel="eds-user-mobiletabbar" />;
}
