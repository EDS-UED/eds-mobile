import { View, type ViewProps } from 'react-native';
import type { EgIconUneyeProps } from './EgIconUneye.types';

/** RN implementation — eds-uneye (component) */
export function EgIconUneye(props: EgIconUneyeProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-uneye' } style={style} accessibilityLabel="eds-uneye" />;
}
