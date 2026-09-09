import { View, type ViewProps } from 'react-native';
import type { EgIconEyeProps } from './EgIconEye.types';

/** RN implementation — eds-eye (component) */
export function EgIconEye(props: EgIconEyeProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-eye' } style={style} accessibilityLabel="eds-eye" />;
}
