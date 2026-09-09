import { View, type ViewProps } from 'react-native';
import type { EgIconBillFillProps } from './EgIconBillFill.types';

/** RN implementation — eds-bill-fill (component) */
export function EgIconBillFill(props: EgIconBillFillProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-bill-fill' } style={style} accessibilityLabel="eds-bill-fill" />;
}
