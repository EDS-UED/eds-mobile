import { View, type ViewProps } from 'react-native';
import type { EgIconEarphoneFillProps } from './EgIconEarphoneFill.types';

/** RN implementation — eds-earphone-fill (component) */
export function EgIconEarphoneFill(props: EgIconEarphoneFillProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-earphone-fill' } style={style} accessibilityLabel="eds-earphone-fill" />;
}
