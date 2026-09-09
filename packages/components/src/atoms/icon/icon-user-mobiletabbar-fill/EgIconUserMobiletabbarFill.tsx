import { View, type ViewProps } from 'react-native';
import type { EgIconUserMobiletabbarFillProps } from './EgIconUserMobiletabbarFill.types';

/** RN implementation — eds-user-mobiletabbar-fill (component) */
export function EgIconUserMobiletabbarFill(props: EgIconUserMobiletabbarFillProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-user-mobiletabbar-fill' } style={style} accessibilityLabel="eds-user-mobiletabbar-fill" />;
}
