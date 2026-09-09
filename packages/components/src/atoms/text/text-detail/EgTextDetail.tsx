import { View, type ViewProps } from 'react-native';
import type { EgTextDetailProps } from './EgTextDetail.types';

/** RN implementation — 5-Detail (set · 6 variants) */
export function EgTextDetail(props: EgTextDetailProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'text-detail' } style={style} accessibilityLabel="5-Detail" />;
}
