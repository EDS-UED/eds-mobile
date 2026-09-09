import { View, type ViewProps } from 'react-native';
import type { EgIconEnableProps } from './EgIconEnable.types';

/** RN implementation — eds-enable (component) */
export function EgIconEnable(props: EgIconEnableProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-enable' } style={style} accessibilityLabel="eds-enable" />;
}
