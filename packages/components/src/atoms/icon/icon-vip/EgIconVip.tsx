import { View, type ViewProps } from 'react-native';
import type { EgIconVipProps } from './EgIconVip.types';

/** RN implementation — eds-vip (component) */
export function EgIconVip(props: EgIconVipProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-vip' } style={style} accessibilityLabel="eds-vip" />;
}
