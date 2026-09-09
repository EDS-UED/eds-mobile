import { View, type ViewProps } from 'react-native';
import type { EgIconVipFillProps } from './EgIconVipFill.types';

/** RN implementation — eds-vip-fill (component) */
export function EgIconVipFill(props: EgIconVipFillProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-vip-fill' } style={style} accessibilityLabel="eds-vip-fill" />;
}
