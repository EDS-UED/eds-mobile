import { View, type ViewProps } from 'react-native';
import type { EgIconEarphoneProps } from './EgIconEarphone.types';

/** RN implementation — eds-earphone (component) */
export function EgIconEarphone(props: EgIconEarphoneProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-earphone' } style={style} accessibilityLabel="eds-earphone" />;
}
