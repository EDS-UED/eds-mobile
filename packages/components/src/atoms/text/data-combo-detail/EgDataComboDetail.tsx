import { View, type ViewProps } from 'react-native';
import type { EgDataComboDetailProps } from './EgDataComboDetail.types';

/** RN implementation — Data Combo/Detail (set · 8 variants) */
export function EgDataComboDetail(props: EgDataComboDetailProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'data-combo-detail' } style={style} accessibilityLabel="Data Combo/Detail" />;
}
