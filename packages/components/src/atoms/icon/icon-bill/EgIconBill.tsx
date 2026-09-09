import { View, type ViewProps } from 'react-native';
import type { EgIconBillProps } from './EgIconBill.types';

/** RN implementation — eds-bill (component) */
export function EgIconBill(props: EgIconBillProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-bill' } style={style} accessibilityLabel="eds-bill" />;
}
